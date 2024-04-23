use chrono::Utc;
use manycore_parser::ManycoreSystem;
use manycore_svg::{BaseConfiguration, Configuration, UpdateResult, SVG};

use serde::Serialize;

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
pub fn update_svg(
    mut configuration: Configuration,
    base_configuration: BaseConfiguration,
    state: tauri::State<State>,
) -> SVGUpdateResult {
    let mut ret = SVGUpdateResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        update: None,
    };

    if let (Ok(mut manycore_mutex), Ok(mut svg_mutex)) = (state.manycore.lock(), state.svg.lock()) {
        if let (Some(manycore), Some(svg)) = (&mut *manycore_mutex, &mut *svg_mutex) {
            match svg.update_configurable_information(
                manycore,
                &mut configuration,
                &base_configuration,
            ) {
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
