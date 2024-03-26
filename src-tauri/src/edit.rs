use std::{env, fs, process::Command};

use manycore_parser::ManycoreSystem;
use serde::Serialize;
use utils::get_editor;
use uuid::Uuid;

mod utils;

use crate::{
    result_status::ResultStatus,
    svg::{generate_svg, SVGResult},
    State,
};

#[tauri::command]
pub async fn initiate_edit(state: tauri::State<'_, State>) -> Result<SVGResult, ()> {
    let mut ret = SVGResult {
        message: String::from("Someething went wrong, please try again."),
        status: ResultStatus::Error,
        svg: None,
    };

    let tmp_dir = env::temp_dir();
    // Full pattern matching becomes really hard to read here. Only using wanted outcomes.
    if let Ok(mut manycore_mutex) = state.manycore.lock() {
        if let Some(manycore) = &*manycore_mutex {
            let mut manycore_string = String::new();
            let mut serializer = quick_xml::se::Serializer::new(&mut manycore_string);
            serializer.indent(' ', 4);

            if let Ok(_) = manycore.serialize(serializer) {
                let file_path = tmp_dir.join(Uuid::new_v4().to_string());
                if let Ok(_) = fs::write(file_path.clone(), manycore_string) {
                    if let Some((editor, args)) = get_editor() {
                        if let Ok(output) = Command::new(editor)
                            .args(args)
                            .arg(file_path.clone())
                            .output()
                        {
                            if output.status.success() {
                                let manycore_parse_res = ManycoreSystem::parse_file(
                                    file_path.to_string_lossy().to_string().as_str(),
                                );

                                match manycore_parse_res {
                                    Ok(manycore) => {
                                        generate_svg(&mut ret, &state, &manycore);

                                        let _ = manycore_mutex.insert(manycore);
                                    }
                                    Err(e) => {
                                        ret.status = ResultStatus::Error;
                                        ret.message = e.to_string();
                                    }
                                }
                            }
                        }
                    }

                    // Delete temporary file, doesn't particularly matter if we fail tho
                    let _ = fs::remove_file(file_path);
                }
            }
        }
    }

    Ok(ret)
}
