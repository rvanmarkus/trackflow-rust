// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::command::add_track_by_file;
use crate::command::get_tracks;

mod command;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, add_track_by_file, get_tracks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
