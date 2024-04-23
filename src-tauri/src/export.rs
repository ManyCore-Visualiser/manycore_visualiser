use std::fs;

use manycore_svg::{BaseConfiguration, Configuration, CoordinateT};
use resvg::{
    render,
    tiny_skia::Pixmap,
    usvg::{Options, Transform, Tree},
};
use serde::{Deserialize, Serialize};
use tauri::{api::dialog::FileDialogBuilder, AppHandle, Manager, Window};

use crate::{State, EXPORT_CONFIGURATION, LOAD_CONFIGURATION};

static OK_EVENT: &'static str = "ok_message";
static ERROR_EVENT: &'static str = "error_message";

static GENERIC_ERROR: &'static str = "Something went wrong, please try again.";

/// Exports the loaded XML file to disk.
pub(crate) fn export_xml(window: Window, state: tauri::State<'_, State>) {
    // Check we got a manycore system
    if let Ok(manycore_guard) = state.manycore.try_lock() {
        if let Some(manycore) = &*manycore_guard {
            // Convert XML to string, pretty print
            let mut xml_string = String::new();
            let mut serializer = quick_xml::se::Serializer::new(&mut xml_string);
            serializer.indent(' ', 4);
            let xml_result = manycore.serialize(serializer);

            // Async file picker, non-blocking of main process
            FileDialogBuilder::new()
                .add_filter("ManyCore XML", &["xml"])
                .save_file(move |output_path| {
                    if let Some(mut output_path) = output_path {
                        // Sanitise extension
                        output_path = output_path.with_extension("xml");

                        if let Ok(_) = xml_result {
                            match fs::write(output_path, xml_string) {
                                Ok(_) => {
                                    let _ = window.emit(OK_EVENT, "Successfully exported XML.");
                                }
                                Err(e) => {
                                    let _ = window.emit(
                                        ERROR_EVENT,
                                        format!("Could not write XML to disk: {e}"),
                                    );
                                }
                            }

                            return;
                        }

                        // Failed to serialise
                        let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
                    }
                });

            // We are done here. File will either be saved or user informed of failure
            return;
        }

        // We don't have a system stored
        let _ = window.emit(ERROR_EVENT, "You must load a system first.");
        return;
    }

    // Couldn't lock mutex
    let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
}

/// Checks data has been loaded then signals frontend to generate configuration
pub(crate) fn export_configuration(window: Window, state: tauri::State<'_, State>) {
    if let Ok(svg_guard) = state.svg.try_lock() {
        if let Some(_) = &*svg_guard {
            let _ = window.emit(EXPORT_CONFIGURATION, 0);
            return;
        }

        // We don't have a system stored
        let _ = window.emit(ERROR_EVENT, "You must load a system first.");
        return;
    }

    // Couldn't lock mutex
    let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct WholeConfiguration {
    base_configuration: BaseConfiguration,
    configuration: Configuration,
}

/// Exports the provided [`WholeConfiguration`] (provided as [`String`] to avoid serde back and forth).
#[tauri::command]
pub(crate) fn store_configuration(window: Window, whole_configuration: String) {
    FileDialogBuilder::new()
        .add_filter("ManyCore Visualiser Configuration", &["json"])
        .save_file(move |output_path| {
            if let Some(mut output_path) = output_path {
                // Sanitise extension
                output_path = output_path.with_extension("json");

                match fs::write(output_path, whole_configuration) {
                    Ok(_) => {
                        let _ = window.emit(OK_EVENT, "Successfully exported configuration.");
                    }
                    Err(e) => {
                        let _ =
                            window.emit(ERROR_EVENT, format!("Could not store configuration: {e}"));
                    }
                }

                return;
            }
        })
}

/// Loads a configuration file from disk.
pub(crate) fn load_configuration(window: Window, state: tauri::State<'_, State>) {
    // Check we got a system loaded
    if let Ok(svg_guard) = state.svg.try_lock() {
        if let Some(_) = &*svg_guard {
            FileDialogBuilder::new()
                .add_filter("ManyCore Visualiser Configuration", &["json"])
                .pick_file(move |file_path| {
                    if let Some(file_path) = file_path {
                        match fs::read_to_string(file_path) {
                            Ok(configuration_content) => {
                                match serde_json::from_str::<WholeConfiguration>(
                                    configuration_content.as_str(),
                                ) {
                                    Ok(_) => {
                                        // We pass configuration_content because it is an already serialised version of the whole configuration.
                                        // We don't need to serialise again.
                                        let _ =
                                            window.emit(LOAD_CONFIGURATION, configuration_content);
                                    }
                                    Err(e) => {
                                        let _ = window.emit(
                                            ERROR_EVENT,
                                            format!(
                                                "Could not process provided configuration: {e}"
                                            ),
                                        );
                                    }
                                }
                            }
                            Err(e) => {
                                let _ = window.emit(
                                    ERROR_EVENT,
                                    format!("Could not open configuration file: {e}"),
                                );
                            }
                        }
                    }
                });

            return;
        }

        // We don't have a system stored
        let _ = window.emit(ERROR_EVENT, "You must load a system first.");
        return;
    }

    // Couldn't lock mutex
    let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
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

#[derive(Deserialize)]
pub(crate) enum RenderMode {
    SVG,
    PNG,
}

/// Exports the [`SVG`] in its current state as SVG or PNG, optionally adding a [`ClipPath`].
#[tauri::command]
pub(crate) fn export_render(
    window: Window,
    handle: AppHandle,
    state: tauri::State<'_, State>,
    clip_path: Option<ClipPathInput>,
    render_mode: RenderMode,
) -> Result<(), ()> {
    if let (Ok(font_database_mutex), Ok(mut svg_mutex)) =
        (state.font_database.try_lock(), state.svg.try_lock())
    {
        if let (font_database, Some(svg)) = (&*font_database_mutex, &mut *svg_mutex) {
            // Clone font database because we can't move it in the asynchronouse file dialogue
            let font_database = font_database.clone();

            // Pretty serialise
            let mut svg_string = String::new();
            let mut serializer = quick_xml::se::Serializer::new(&mut svg_string);
            serializer.indent(' ', 4);

            let (svg_string_res, width, height) = match clip_path {
                Some(clip_path) => {
                    let view_box = svg.view_box_mut().swap(
                        clip_path.x,
                        clip_path.y,
                        clip_path.width,
                        clip_path.height,
                    );

                    svg.add_freeform_clip_path(clip_path.clip_path);
                    let res = svg.serialize(serializer);

                    svg.view_box_mut().restore_from(&view_box);
                    svg.clear_freeform_clip_path();

                    (res, clip_path.width, clip_path.height)
                }
                None => (
                    svg.serialize(serializer),
                    *svg.view_box().width(),
                    *svg.view_box().height(),
                ),
            };

            let (filter_name, extension, message) = match render_mode {
                RenderMode::PNG => (
                    "Portable Network Graphics (PNG)",
                    "png",
                    "Successfully exported PNG",
                ),
                RenderMode::SVG => (
                    "Scalable Vector Graphics (SVG)",
                    "svg",
                    "Successfully exported SVG",
                ),
            };

            // Clone the window label
            let window_label = window.label().to_owned();
            match svg_string_res {
                Ok(_) => {
                    // Open file picker
                    FileDialogBuilder::new()
                        .add_filter(filter_name, &[extension])
                        .save_file(move |file_path| {
                            // Ensure user has picked a file path
                            if let Some(mut file_path) = file_path {
                                file_path = file_path.with_extension(extension);

                                // Try to grab the original window
                                match handle.get_window(window_label.as_str()) {
                                    Some(window) => match render_mode {
                                        // Attempt PNG -> SVG conversion
                                        RenderMode::PNG => match Tree::from_str(
                                            svg_string.as_str(),
                                            &Options::default(),
                                            &font_database,
                                        ) {
                                            Ok(tree) => {
                                                let target_height = u32::try_from(height).unwrap();
                                                let target_width = u32::try_from(width).unwrap();
                                                // Attempt PNG buffer allocation
                                                let target_image =
                                                    Pixmap::new(target_width, target_height);
                                                match target_image {
                                                    Some(mut img_buf) => {
                                                        // Write PNG to buffer
                                                        // This just does the rendering, no result/option
                                                        render(
                                                            &tree,
                                                            Transform::default(),
                                                            &mut img_buf.as_mut(),
                                                        );
                                                        // Attempt writing PNG to disk
                                                        match img_buf.save_png(file_path) {
                                                            Ok(_) => {
                                                                let _ =
                                                                    window.emit(OK_EVENT, message);
                                                            }
                                                            Err(e) => {
                                                                let _ = window.emit(
                                                                    ERROR_EVENT,
                                                                    e.to_string(),
                                                                );
                                                            }
                                                        }
                                                    }
                                                    None => {
                                                        let _ = window.emit(
                                                        ERROR_EVENT,
                                                        "Could not allocate memory to generate PNG",
                                                    );
                                                    }
                                                }
                                            }
                                            Err(e) => {
                                                // Couldn't convert SVG to simplified tree
                                                let _ = window.emit(ERROR_EVENT, e.to_string());
                                            }
                                        },
                                        // Attempt writing SVG string to disk
                                        RenderMode::SVG => match fs::write(file_path, svg_string) {
                                            Ok(_) => {
                                                let _ = window.emit(OK_EVENT, message);
                                            }
                                            Err(e) => {
                                                let _ = window.emit(ERROR_EVENT, e.to_string());
                                            }
                                        },
                                    },
                                    None => {
                                        // Could not grab the window
                                        let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
                                    }
                                }
                            }
                        });
                    return Ok(());
                }
                Err(e) => {
                    let _ = window.emit(
                        ERROR_EVENT,
                        format!("Could not generate intermediate SVG: {e}"),
                    );
                    return Ok(());
                }
            }
        } else {
            let _ = window.emit(ERROR_EVENT, "You must load a system first.");
            return Ok(());
        }
    }

    // Could not lock mutex
    let _ = window.emit(ERROR_EVENT, GENERIC_ERROR);
    return Ok(());
}