use manycore_parser::ManycoreSystem;
use serde::Serialize;

use crate::State;

#[derive(Serialize, Debug)]
enum ParseResultStatus {
    #[serde(rename = "ok")]
    Ok,
    #[serde(rename = "error")]
    Error,
}

#[derive(Serialize, Debug)]
pub struct ParseResult {
    status: ParseResultStatus,
    message: String,
}

fn format_error_response(ret: &mut ParseResult, msg: String) {
    ret.status = ParseResultStatus::Error;
    ret.message = msg;
}

#[tauri::command]
pub fn parse(file_path: &str, state: tauri::State<State>) -> ParseResult {
    let manycore_parse_res = ManycoreSystem::parse_file(file_path);

    let mut ret = ParseResult {
        status: ParseResultStatus::Ok,
        message: String::from("Successfully parsed file"),
    };

    match manycore_parse_res {
        Ok(manycore) => match state.manycore.lock() {
            Ok(mut manycore_mutex) => {
                let _ = manycore_mutex.insert(manycore);
            }
            Err(e) => {
                format_error_response(&mut ret, e.to_string());
            }
        },
        Err(e) => {
            format_error_response(&mut ret, e.to_string());
        }
    }

    return ret;
}
