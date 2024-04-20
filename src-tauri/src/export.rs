use std::{fmt::format, fs};

use manycore_svg::{BaseConfiguration, Configuration};
use serde::{Deserialize, Serialize};
use tauri::{api::dialog::FileDialogBuilder, Window};

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

// remember to call `.manage(MyState::default())`
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
