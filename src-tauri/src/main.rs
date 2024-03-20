// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use base64::{engine::general_purpose, Engine as _};
use id3::{Tag, TagLike};
use std::fs;

#[tauri::command]
async fn get_paths(folders: Vec<String>) -> Vec<String> {
    println!("Folders {:?}", folders);
    let mut files: Vec<String> = Vec::new();
    for folder in folders {
        let mut list: Vec<String> = fs::read_dir(folder)
            .unwrap()
            .map(|x| x.unwrap().path())
            .filter(|x| match x.extension() {
                Some(x) => x == "mp3",
                None => false,
            })
            .map(|x| x.to_str().unwrap().to_string())
            .collect();
        files.append(&mut list);
    }
    files.dedup();
    files
}

/// ##    get tag
/// Returns title, artist, duration, album, picture of given path
///
/// ## Arguments
/// * `path` - path to mp3
///
/// ## Examples
/// ```
/// let (title, artist, duration, album, picture) = get_tag("path/to/mp3".to_string());
/// ```
///
///
#[tauri::command]
async fn get_tag(path: String) -> (String, String, u32, String, String) {
    let tag = match Tag::read_from_path(&path) {
        Ok(x) => x,
        Err(_) => {
            return (
                String::new(),
                String::new(),
                0,
                String::new(),
                String::new(),
            );
        }
    };
    if (tag.title().is_some() && tag.artist().is_some()) || tag.duration().is_some() {
        let mut picture: Vec<u8> = vec![];

        for ele in tag.pictures() {
            picture = ele.data.to_vec().to_owned();
        }

        return (
            tag.title().unwrap_or("").trim().to_string(),
            tag.artist().unwrap_or("").trim().to_string(),
            tag.duration().unwrap_or(0) as u32,
            tag.album().unwrap_or("").trim().to_string(),
            general_purpose::STANDARD.encode(picture),
        );
    } else {
        return (
            String::new(),
            String::new(),
            0,
            String::new(),
            String::new(),
        );
    }
}

fn main() {
    tauri::Builder::default()
        .any_thread()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_tag, get_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
