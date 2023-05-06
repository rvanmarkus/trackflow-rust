// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::command::add_track_by_file;
use crate::command::get_tracks;
use crate::command::remove_track;
use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tauri_ui::establish_connection;

mod command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("migrations");

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let mut connection = establish_connection();
            connection
                .run_pending_migrations(MIGRATIONS)
                .expect("Error setting up database");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            add_track_by_file,
            get_tracks,
            remove_track
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
