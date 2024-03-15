// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use id3::{Tag, TagLike};
use std::fs;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn get_paths() -> Vec<String> {
    fs::read_dir("D:\\music")
        .unwrap()
        .map(|x| x.unwrap().path())
        .filter(|x| match x.extension() {
            Some(x) => x == "mp3",
            None => false,
        })
        .map(|x| x.to_str().unwrap().to_string())
        .collect()
}

#[tauri::command]
fn get_tag(path: String) -> Vec<(String, String, u32)> {
    let tag = match Tag::read_from_path(path) {
        Ok(x) => x,
        Err(_) => return vec![],
    };
    if (tag.title().is_some() && tag.artist().is_some()) || tag.duration().is_some() {
        return vec![(
            tag.title().unwrap_or("").trim().to_string(),
            tag.artist().unwrap_or("").trim().to_string(),
            tag.duration().unwrap_or(0),
        )];
    } else {
        return vec![];
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet, get_tag, get_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
