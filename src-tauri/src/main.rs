// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use base64::{engine::general_purpose, Engine as _};
use id3::{Tag, TagLike};
use std::{fs, time::SystemTime};

#[tauri::command]
async fn get_paths(folders: Vec<String>, sort_by: String, search_text: String) -> Vec<String> {
    println!("Folders {:?}", folders);
    println!("Sort By {:?}", sort_by);
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
    if !search_text.is_empty() {
        let tmp = &files
            .into_iter()
            .filter(|x| {
                let tag = Tag::read_from_path(x).unwrap_or(Tag::new());
                return tag
                    .title()
                    .unwrap_or("")
                    .to_lowercase()
                    .contains(&search_text)
                    || tag
                        .artist()
                        .unwrap_or("")
                        .to_lowercase()
                        .contains(&search_text)
                    || tag
                        .album()
                        .unwrap_or("")
                        .to_lowercase()
                        .contains(&search_text);
            })
            .collect::<Vec<String>>();
        files = tmp.to_vec();
    }
    match sort_by.as_str() {
        "Time Created" => {
            files.sort_by(|a, b| {
                fs::metadata(b.to_string())
                    .unwrap()
                    .created()
                    .unwrap()
                    .cmp(&fs::metadata(a.to_string()).unwrap().created().unwrap())
            });
        }
        "Title" => {
            files.sort_by(|a, b| {
                Tag::read_from_path(&a)
                    .unwrap_or(Tag::new())
                    .title()
                    .unwrap_or("")
                    .cmp(
                        &Tag::read_from_path(&b)
                            .unwrap_or(Tag::new())
                            .title()
                            .unwrap_or(""),
                    )
            });
        }
        "Artist" => files.sort_by(|a, b| {
            Tag::read_from_path(&a)
                .unwrap_or(Tag::new())
                .artist()
                .unwrap_or("")
                .cmp(
                    &Tag::read_from_path(&b)
                        .unwrap_or(Tag::new())
                        .artist()
                        .unwrap_or(""),
                )
        }),
        _ => {
            files.sort_by(|a, b| {
                fs::metadata(b.to_string())
                    .unwrap()
                    .created()
                    .unwrap()
                    .cmp(&fs::metadata(a.to_string()).unwrap().created().unwrap())
            });
        }
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
///
/// ```
///
///
#[tauri::command]
async fn get_tag(path: String) -> (String, String, String, String, SystemTime) {
    let tag = match Tag::read_from_path(&path) {
        Ok(x) => x,
        Err(_) => {
            return (
                String::new(),
                String::new(),
                String::new(),
                String::new(),
                SystemTime::UNIX_EPOCH,
            );
        }
    };
    if (tag.title().is_some() && tag.artist().is_some()) || tag.duration().is_some() {
        let mut picture: Vec<u8> = vec![];

        for ele in tag.pictures() {
            picture = ele.data.to_vec().to_owned();
        }

        return (
            tag.title().unwrap_or(&path).trim().to_string(),
            tag.artist().unwrap_or("").trim().to_string(),
            tag.album().unwrap_or("").trim().to_string(),
            general_purpose::STANDARD.encode(picture),
            fs::metadata(path)
                .unwrap()
                .created()
                .unwrap_or(SystemTime::UNIX_EPOCH),
        );
    } else {
        return (
            String::new(),
            String::new(),
            String::new(),
            String::new(),
            SystemTime::UNIX_EPOCH,
        );
    }
}

fn main() {
    tauri::Builder::default()
        .any_thread()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_paths, get_tag])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
