// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod configuration;
mod parse;
mod result_status;
mod svg;

use std::sync::{Arc, Mutex};

use manycore_parser::ManycoreSystem;
use manycore_svg::SVG;

#[derive(Default)]
pub struct State {
    pub manycore: Arc<Mutex<Option<ManycoreSystem>>>,
    pub svg: Arc<Mutex<Option<SVG>>>,
}

fn main() {
    tauri::Builder::default()
        .manage(State::default())
        .invoke_handler(tauri::generate_handler![
            parse::parse,
            svg::get_svg,
            configuration::get_attributes
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
