use manycore_parser::ConfigurableAttributes;
use serde::Serialize;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct AttributesResult {
    status: ResultStatus,
    message: String,
    attributes: Option<ConfigurableAttributes>,
}

#[tauri::command]
pub fn get_attributes(state: tauri::State<State>) -> AttributesResult {
    let mut ret = AttributesResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        attributes: None,
    };

    if let Ok(manycore_mutex) = state.manycore.lock() {
        match &*manycore_mutex {
            Some(manycore) => {
                ret.status = ResultStatus::Ok;
                ret.message = String::from("Ok");
                // TODO: Might want to do this without clone if possible, can't think of how now
                ret.attributes = Some(manycore.configurable_attributes().clone());
            }
            None => {
                ret.message = String::from("Load a system before generating a render.");
            }
        }
    }

    ret
}
