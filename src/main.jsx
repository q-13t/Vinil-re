import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, createDir, exists, readDir, readTextFile, writeFile } from "@tauri-apps/api/fs";
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
        return await exists("Playlists", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (!exists) {
                return await createDir('Playlists', { dir: BaseDirectory.AppConfig, recursive: true }).then(async () => {
                    return await writeFile(`Playlists\\${name}.json`, JSON.stringify(entries), { dir: BaseDirectory.AppConfig, recursive: true });
                });
            } else {
                return await writeFile(`Playlists\\${name}.json`, JSON.stringify(entries), { dir: BaseDirectory.AppConfig, recursive: true });
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });

    },

    async appendSong(playlist, selectedSongs) {
        return await utils.getPlaylist(playlist).then(async (entries) => {

            return await writeFile(`${playlist}`, JSON.stringify(entries.concat(selectedSongs)), { dir: BaseDirectory.AppConfig, recursive: true });
        })
    },

    async getPlaylist(path) {
        return await readTextFile(`${path}`, { dir: BaseDirectory.AppConfig }).then((data) => {
            return JSON.parse(data);
        });
    }

};

export default utils;


ReactDOM.createRoot(document.getElementById("root")).render(<MainWindow />);