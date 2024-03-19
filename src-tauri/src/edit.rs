use std::{env, fs, process::Command};

use serde::Serialize;
use utils::get_editor;
use uuid::Uuid;

mod utils;

use crate::{result_status::ResultStatus, State};

#[derive(Serialize)]
pub struct EditingResult {
    status: ResultStatus,
    message: String,
}

#[tauri::command]
pub fn initiate_edit(state: tauri::State<State>) {
    let tmp_dir = env::temp_dir();
    // Full pattern matching becomes really hard to read here. Only using wanted outcomes.
    if let Ok(manycore_mutex) = state.manycore.lock() {
        if let Some(manycore) = &*manycore_mutex {
            let mut manycore_string = String::new();
            let mut serializer = quick_xml::se::Serializer::new(&mut manycore_string);
            serializer.indent(' ', 4);

            if let Ok(_) = manycore.serialize(serializer) {
                let file_path = tmp_dir.join(Uuid::new_v4().to_string());
                if let Ok(_) = fs::write(file_path.clone(), manycore_string) {
                    if let Some((editor, args)) = get_editor() {
                        if let Ok(output) = Command::new(editor).args(args).arg(file_path).output()
                        {
                            println!("{:?}", output)
                        }
                    }
                }
            }
        }
    }
}
