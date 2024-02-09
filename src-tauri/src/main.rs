// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod parse;

use std::sync::Mutex;

use manycore_parser::ManycoreSystem;

#[derive(Default)]
pub struct State {
    pub manycore: Mutex<Option<ManycoreSystem>>,
}

fn main() {
    tauri::Builder::default()
        .manage(State::default())
        .invoke_handler(tauri::generate_handler![parse::parse])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
