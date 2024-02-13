use manycore_svg::SVG;
use serde::Serialize;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct SVGResult {
    status: ResultStatus,
    message: String,
    svg: Option<String>,
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
                let svg = SVG::from(manycore);

                if let Ok(mut svg_mutex) = state.svg.lock() {
                    match String::try_from(&svg) {
                        Ok(svg_string) => {
                            let _ = svg_mutex.insert(svg);

                            ret.status = ResultStatus::Ok;
                            ret.message = String::from("Successfully generated SVG");
                            ret.svg = Some(svg_string);
                        }
                        Err(e) => {
                            ret.message = e.to_string();
                        }
                    }
                }

                ret.message = String::from("Could not update render, please try again.")
            }
            None => {
                ret.message = String::from("Load a system before generating a render.");
            }
        }
    }

    ret
}
