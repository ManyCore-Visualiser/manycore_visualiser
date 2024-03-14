use std::collections::BTreeMap;

use serde::Serialize;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct InfoResult {
    status: ResultStatus,
    message: String,
    info: Option<BTreeMap<String, String>>,
}

#[tauri::command]
pub fn get_info(group_id: String, state: tauri::State<State>) -> InfoResult {
    let mut ret = InfoResult {
        status: ResultStatus::Error,
        message: String::from("Something went wrong, please try again."),
        info: None,
    };

    if let Ok(manycore_mutex) = state.manycore.lock() {
        if let Some(manycore) = &*manycore_mutex {
            match manycore.get_core_router_specific_info(group_id) {
                Ok(info_tree) => {
                    ret.status = ResultStatus::Ok;
                    ret.message = String::from("Successfully retrieved attributes");
                    ret.info = info_tree;
                }
                Err(e) => {
                    ret.message = e.to_string();
                }
            }
        }
    }

    ret
}
