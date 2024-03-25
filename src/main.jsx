import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, exists, readDir, readTextFile, writeFile } from "@tauri-apps/api/fs";
import MainWindow from "./MainWindow";

const utils = {
    async getFolders() {
        return await exists("folders.json", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {
                return await readTextFile('folders.json', { dir: BaseDirectory.AppConfig }).then((data) => {
                    return JSON.parse(data);
                })
            } else {
                return await writeFile('folders.json', { dir: BaseDirectory.AppConfig, recursive: true }).then(() => {
                    return [];
                });
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    },

    async getPlaylists() {
        return await exists("Playlists", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {
                return await readDir('Playlists', { dir: BaseDirectory.AppConfig, recursive: true }).then((entries) => {
                    return entries;
                });
            } else {
                return await createDir('Playlists', { dir: BaseDirectory.AppConfig, recursive: true });
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    },

    async savePlaylist(name, entries) {
        return await writeFile(`Playlists\\${name}.json`, JSON.stringify(entries), { dir: BaseDirectory.AppConfig, recursive: true });
    },

    async appendSong(playlist, selectedSongs) {
        console.log("appendSong", playlist, selectedSongs);
        return await writeFile(`Playlists\\${playlist}.json`, JSON.stringify(selectedSongs), { dir: BaseDirectory.AppConfig, recursive: true, append: true });
    }

};

export default utils;


ReactDOM.createRoot(document.getElementById("root")).render(<MainWindow />);