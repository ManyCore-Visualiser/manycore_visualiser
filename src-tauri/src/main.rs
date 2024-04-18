// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod configuration;
mod parse;
mod result_status;
mod svg;
mod info;
mod edit;

use std::sync::{Arc, Mutex};

use manycore_parser::ManycoreSystem;
use manycore_svg::SVG;
use resvg::usvg::fontdb::Database;

pub struct State {
    pub manycore: Arc<Mutex<Option<ManycoreSystem>>>,
    pub svg: Arc<Mutex<Option<SVG>>>,
    pub font_database: Arc<Mutex<Database>>,
}

impl State {
    fn new() -> Self {
        let mut font_database = Database::new();
        let robot = include_bytes!("../assets/Roboto Mono.ttf");
        font_database.load_font_data(robot.to_vec());

        let font_database_arc = Arc::new(Mutex::new(font_database));

        Self {
            manycore: Arc::default(),
            svg: Arc::default(),
            font_database: font_database_arc,
        }
    }
}

fn main() {
    tauri::Builder::default()
        .manage(State::new())
        .invoke_handler(tauri::generate_handler![
            parse::parse,
            svg::get_svg,
            svg::update_svg,
            svg::render_svg,
            configuration::get_attributes,
            configuration::get_base_configuration,
            info::get_info,
            edit::initiate_edit
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
