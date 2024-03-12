use manycore_svg::{Configuration, UpdateResult, SVG};
use resvg::{
    render,
    tiny_skia::Pixmap,
    usvg::{Options, Transform, Tree},
};
use serde::Serialize;
use tauri::api::dialog::blocking::FileDialogBuilder;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct SVGResult {
    status: ResultStatus,
    message: String,
    svg: Option<String>,
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
                let svg: SVG = manycore.into();

                if let (Ok(mut svg_mutex), Ok(mut svg_string_mutex)) =
                    (state.svg.lock(), state.svg_string.lock())
                {
                    match String::try_from(&svg) {
                        Ok(svg_string) => {
                            let _ = svg_mutex.insert(svg);
                            let _ = svg_string_mutex.insert(svg_string.clone());

                            ret.status = ResultStatus::Ok;
                            ret.message = String::from("Successfully generated SVG");
                            ret.svg = Some(svg_string);
                        }
                        Err(e) => {
                            ret.message = e.to_string();
                        }
                    }

                    return ret;
                }
                // Couldn't lock mutex
                ret.message = String::from("Could not update render, please try again.");
            }
            None => {
                ret.message = String::from("Load a system before generating a render.");
            }
        }
    }

    ret
}

#[tauri::command]
pub fn update_svg(configuration: Configuration, state: tauri::State<State>) -> SVGUpdateResult {
    let mut ret = SVGUpdateResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        update: None,
    };

    if let (Ok(mut manycore_mutex), Ok(mut svg_mutex)) = (state.manycore.lock(), state.svg.lock()) {
        if let (Some(manycore), Some(svg)) = (&mut *manycore_mutex, &mut *svg_mutex) {
            match svg.update_configurable_information(manycore, &configuration) {
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

// This is async because we use the blocking file dialog builder api
#[tauri::command]
pub async fn render_svg(state: tauri::State<'_, State>) -> Result<SVGRenderResult, ()> {
    let mut ret = SVGRenderResult {
        status: ResultStatus::Ok,
        message: String::from("Successfully rendered SVG."),
    };

    if let (Ok(svg_string_mutex), Ok(font_database_mutex), Ok(svg_mutex)) = (
        state.svg_string.lock(),
        state.font_database.lock(),
        state.svg.lock(),
    ) {
        if let (Some(svg_string), font_database, Some(svg)) =
            (&*svg_string_mutex, &*font_database_mutex, &*svg_mutex)
        {
            let tree = Tree::from_str(svg_string, &Options::default(), font_database).unwrap();
            let target_image = Pixmap::new((*svg.width()).into(), (*svg.height()).into());

            if let Some(mut img_buf) = target_image {
                render(&tree, Transform::default(), &mut img_buf.as_mut());
                if let Some(path) = FileDialogBuilder::new().save_file() {
                    match img_buf.save_png(path.as_os_str()) {
                        Ok(_) => {
                            return Ok(ret);
                        }
                        Err(e) => {
                            ret.status = ResultStatus::Error;
                            ret.message = e.to_string();
                        }
                    }
                }
            }
        }

        ret.status = ResultStatus::Error;
        ret.message = String::from("Generate SVG before rendering to PNG.")
    }

    // Couldn't lock mutexes
    ret.status = ResultStatus::Error;
    ret.message = String::from("Something went wrong, please try again.");

    return Ok(ret);
}
