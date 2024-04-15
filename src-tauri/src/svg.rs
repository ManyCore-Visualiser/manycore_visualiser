use chrono::Utc;
use manycore_parser::ManycoreSystem;
use manycore_svg::{Configuration, CoordinateT, UpdateResult, SVG};
use resvg::{
    render,
    tiny_skia::Pixmap,
    usvg::{Options, Transform, Tree},
};
use serde::{Deserialize, Serialize};
use tauri::api::dialog::blocking::FileDialogBuilder;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct SVGObject {
    content: String,
    timestamp: String,
}

#[derive(Serialize)]
pub struct SVGResult {
    pub status: ResultStatus,
    pub message: String,
    pub svg: Option<SVGObject>,
}

#[derive(Serialize)]
pub struct SVGUpdateResult {
    status: ResultStatus,
    message: String,
    update: Option<UpdateResult>,
}

#[derive(Serialize)]
pub struct SVGRenderResult {
    status: ResultStatus,
    message: String,
}

pub fn generate_svg(ret: &mut SVGResult, state: &tauri::State<State>, manycore: &ManycoreSystem) {
    let svg = SVG::try_from(manycore);

    if let Ok(svg) = svg {
        if let Ok(mut svg_mutex) = state.svg.lock() {
            match String::try_from(&svg) {
                Ok(svg_string) => {
                    let _ = svg_mutex.insert(svg);

                    ret.status = ResultStatus::Ok;
                    ret.message = String::from("Successfully generated SVG");
                    ret.svg = Some(SVGObject {
                        content: svg_string,
                        timestamp: Utc::now().to_string(),
                    });
                }
                Err(e) => {
                    ret.message = e.to_string();
                }
            }

            return;
        }
        // Couldn't lock mutex
        ret.message = String::from("Could not update render, please try again.");
    } else if let Err(svg_error) = svg {
        // Couldn't convert svg
        ret.message = svg_error.to_string();
    }
}

#[tauri::command]
pub fn get_svg(state: tauri::State<State>) -> SVGResult {
    let mut ret = SVGResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        svg: None,
    };

    if let Ok(manycore_mutex) = state.manycore.lock() {
        // Reference inner value of mutex without taking ownership.
        // Value in option is preserved.
        match &*manycore_mutex {
            Some(manycore) => {
                generate_svg(&mut ret, &state, manycore);
            }
            None => {
                ret.message = String::from("Load a system before generating a render.");
            }
        }
    }

    ret
}

#[tauri::command]
pub fn update_svg(mut configuration: Configuration, state: tauri::State<State>) -> SVGUpdateResult {
    let mut ret = SVGUpdateResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        update: None,
    };

    if let (Ok(mut manycore_mutex), Ok(mut svg_mutex)) = (state.manycore.lock(), state.svg.lock()) {
        if let (Some(manycore), Some(svg)) = (&mut *manycore_mutex, &mut *svg_mutex) {
            match svg.update_configurable_information(manycore, &mut configuration) {
                Ok(update) => {
                    ret.status = ResultStatus::Ok;
                    ret.message = String::from("Successfully generated SVG");
                    ret.update = Some(update);

                    return ret;
                }
                Err(e) => ret.message = e.to_string(),
            }
        }
    }

    ret
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClipPathInput {
    clip_path: String,
    x: CoordinateT,
    y: CoordinateT,
    width: CoordinateT,
    height: CoordinateT,
}

// This is async because we use the blocking file dialog builder api
#[tauri::command]
pub async fn render_svg(
    clip_path: Option<ClipPathInput>,
    state: tauri::State<'_, State>,
) -> Result<SVGRenderResult, ()> {
    let mut ret = SVGRenderResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
    };

    if let (Ok(font_database_mutex), Ok(mut svg_mutex)) =
        (state.font_database.lock(), state.svg.lock())
    {
        if let (font_database, Some(svg)) = (&*font_database_mutex, &mut *svg_mutex) {
            let (svg_string_res, width, height) = match clip_path {
                Some(clip_path) => {
                    let view_box = svg.view_box_mut().swap(
                        clip_path.x,
                        clip_path.y,
                        clip_path.width,
                        clip_path.height,
                    );

                    svg.add_clip_path(clip_path.clip_path);
                    let res = String::try_from(svg as &SVG);

                    svg.view_box_mut().restore_from(&view_box);
                    svg.clear_clip_path();

                    (res, clip_path.width, clip_path.height)
                }
                None => (
                    String::try_from(svg as &SVG),
                    *svg.view_box().width(),
                    *svg.view_box().height(),
                ),
            };

            // Downgrade reference to unmutable
            match svg_string_res {
                Ok(svg_string) => {
                    let tree =
                        Tree::from_str(svg_string.as_str(), &Options::default(), font_database)
                            .unwrap();

                    let target_height = u32::try_from(height).unwrap();
                    let target_width = u32::try_from(width).unwrap();
                    let target_image = Pixmap::new(target_width, target_height);

                    if let Some(mut img_buf) = target_image {
                        render(&tree, Transform::default(), &mut img_buf.as_mut());
                        if let Some(path) = FileDialogBuilder::new()
                            .add_filter("Portable Network Graphics (PNG)", &["png"])
                            .save_file()
                        {
                            match img_buf.save_png(path.as_os_str()) {
                                Ok(_) => {
                                    ret.status = ResultStatus::Ok;
                                    ret.message = String::from("Successfully rendered SVG.");

                                    return Ok(ret);
                                }
                                Err(e) => ret.message = e.to_string(),
                            }
                        }
                    }
                }
                Err(e) => ret.message = e.to_string(),
            }
        } else {
            ret.status = ResultStatus::Error;
            ret.message = String::from("Generate SVG before rendering to PNG.")
        }
    }

    return Ok(ret);
}
