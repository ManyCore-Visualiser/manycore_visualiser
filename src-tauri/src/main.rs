// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod configuration;
mod edit;
mod export;
mod info;
mod parse;
mod result_status;
mod svg;

use std::{
    error::Error,
    sync::{Arc, Mutex},
};

use export::{export_configuration, export_xml, load_configuration};
use manycore_parser::ManycoreSystem;
use manycore_svg::SVG;
use resvg::usvg::fontdb::Database;
use tauri::{App, AppHandle, CustomMenuItem, Manager, Menu, Submenu};

// Event names
static LOAD_NEW_SYSTEM: &'static str = "load_new_system";
static LOAD_CONFIGURATION: &'static str = "load_config";
static EXPORT_CONFIGURATION: &'static str = "export_config";
static EXPORT_XML: &'static str = "export_xml";
static LICENSES: &'static str = "licenses";
static LICENSES_TITLE: &'static str = "Licenses";
static MANUAL: &'static str = "manual";
static MANUAL_TITLE: &'static str = "User manual";

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
            manycore: Default::default(),
            svg: Default::default(),
            font_database: font_database_arc,
        }
    }
}

fn open_window(handle: &AppHandle, path: &str, title: &str) {
    if let Ok(window) =
        tauri::WindowBuilder::new(handle, LICENSES, tauri::WindowUrl::App(path.into())).build()
    {
        let _ = window.set_title(title);
        let _ = window.menu_handle().hide();
    }
}

fn app_setup(app: &mut App) -> Result<(), Box<dyn Error>> {
    let main_window = app.get_window("main").unwrap();
    let handle = app.handle();

    // Move is gonna capture handle in the closure environment
    main_window.on_menu_event(move |event| {
        let window = handle.get_window("main").unwrap();

        let event_id = event.menu_item_id();

        if event_id == LOAD_NEW_SYSTEM {
            let _ = window.emit(LOAD_NEW_SYSTEM, 0);
        } else if event_id == LOAD_CONFIGURATION {
            load_configuration(window, handle.state());
        } else if event_id == EXPORT_XML {
            export_xml(window, handle.state());
        } else if event_id == EXPORT_CONFIGURATION {
            export_configuration(window, handle.state());
        } else if event_id == LICENSES {
            open_window(&handle, "/licenses.html", &LICENSES_TITLE);
        } else if event_id == MANUAL {
            open_window(&handle, "/manual/index.html", &MANUAL_TITLE);
        }
    });

    Ok(())
}

fn main() {
    let load_submenu = Menu::new()
        .add_item(CustomMenuItem::new(LOAD_NEW_SYSTEM, "Load new system"))
        .add_item(CustomMenuItem::new(
            LOAD_CONFIGURATION,
            "Load configuration",
        ));
    let load = Submenu::new("Load", load_submenu);

    let export_submenu = Menu::new()
        .add_item(CustomMenuItem::new(
            EXPORT_CONFIGURATION,
            "Export configuration",
        ))
        .add_item(CustomMenuItem::new(EXPORT_XML, "Export XML"));
    let export = Submenu::new("Export", export_submenu);

    let menu = Menu::new()
        .add_native_item(tauri::MenuItem::CloseWindow)
        .add_submenu(load)
        .add_submenu(export)
        .add_item(CustomMenuItem::new(LICENSES, LICENSES_TITLE))
        .add_item(CustomMenuItem::new(MANUAL, MANUAL_TITLE));

    tauri::Builder::default()
        .menu(menu)
        .manage(State::new())
        .invoke_handler(tauri::generate_handler![
            parse::parse,
            svg::get_svg,
            svg::update_svg,
            configuration::get_attributes,
            configuration::get_base_configuration,
            info::get_info,
            edit::initiate_edit,
            export::store_configuration,
            export::export_render,
        ])
        .setup(&app_setup)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
