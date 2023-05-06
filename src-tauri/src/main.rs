// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tauri_ui::establish_connection;

mod command;
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
            command::add_track_by_file,
            command::get_tracks,
            command::analyse_bpm_track,
            command::remove_track
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
