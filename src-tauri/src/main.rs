// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

use base64::{engine::general_purpose, Engine as _};
use id3::{Tag, TagLike};
use image::codecs::png::PngEncoder;
use image::ImageEncoder;
use std::{fs, time::SystemTime};

#[tauri::command]
///
/// Returns list of paths to mp3 files that are ordered in a certain way.
///
/// ### Parameters
/// - `folders`: List of folders to search in
/// - `sort_by`: `Time Created` | `Title` | `Artist` | `Album`
/// - `search_text`: Search text or `""`
///### Returns
/// - `Vec<String>`: List of paths
///### Example
/// ```js
/// let paths = await invoke("get_paths", {folders: ["C:\\Music"], sortBy: "Time Created", searchText: ""});
/// ```
///
async fn get_paths(folders: Vec<String>, sort_by: String, search_text: String) -> Vec<String> {
    // println!("Folders {:?}", folders);
    // println!("Sort By {:?}", sort_by);
    let mut files: Vec<String> = Vec::new();
    for folder in folders {
        let mut list: Vec<String> = fs::read_dir(folder)
            .unwrap()
            .filter(|x| x.as_ref().unwrap().metadata().unwrap().len() != 0)
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

    files.dedup(); //remove duplicates

    return files;
}

#[tauri::command]
///
/// Returns title, artist, album, image and created time
/// ### Parameters
/// - `path`: Path to `valid` mp3 file
/// ### Returns
/// - `(title, artist, album, image, created)`
/// ### Example
/// ```js
/// let (title, artist, album, image, created) = await invoke("get_tag", {path: "C:\\Music\\test.mp3"});
/// ```
async fn get_tag(path: String) -> (String, String, String, String, SystemTime) {
    let tag = match Tag::read_from_path(&path) {
        Ok(tag) => tag,
        Err(_) => {
            return (
                String::new(),
                String::new(),
                String::new(),
                String::new(),
                SystemTime::UNIX_EPOCH,
            )
        }
    };

    let picture = tag.pictures().next();

    let title = tag.title().unwrap_or(&path).trim().to_string();
    let artist = tag.artist().unwrap_or("").trim().to_string();
    let album = tag.album().unwrap_or("").trim().to_string();

    let data = if let Some(picture) = picture {
        let image = image::load_from_memory(&picture.data).unwrap();
        let resized_image = image.resize_exact(200, 200, image::imageops::FilterType::Triangle);
        let mut data = vec![];
        let encoder = PngEncoder::new(&mut data);
        encoder
            .write_image(
                &resized_image.into_bytes(),
                200,
                200,
                image::ExtendedColorType::Rgb8,
            )
            .unwrap();
        general_purpose::STANDARD.encode(data)
    } else {
        String::new()
    };

    (
        title,
        artist,
        album,
        data,
        fs::metadata(&path)
            .unwrap()
            .created()
            .unwrap_or(SystemTime::UNIX_EPOCH),
    )
}

fn main() {
    tauri::Builder::default()
        .any_thread()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![get_paths, get_tag])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
