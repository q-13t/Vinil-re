import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, createDir, exists, readDir, readTextFile, removeFile, renameFile, writeFile } from "@tauri-apps/api/fs";
import MainWindow from "./MainWindow";
import { BrowserRouter } from "react-router-dom";

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
                    return await writeFile(`Playlists\\${name}`, JSON.stringify(entries), { dir: BaseDirectory.AppConfig, recursive: true });
                });
            } else {
                return await writeFile(`Playlists\\${name}`, JSON.stringify(entries), { dir: BaseDirectory.AppConfig, recursive: true });
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });

    },

    async appendSong(PlaylistPath, songsToAdd) {
        return await utils.getPlaylist(PlaylistPath).then(async (entries) => {
            return await writeFile(`${PlaylistPath}`, JSON.stringify(entries.concat(songsToAdd)), { dir: BaseDirectory.AppConfig, recursive: true });
        })
    },

    async getPlaylist(path) {
        return await readTextFile(`${path}`, { dir: BaseDirectory.AppConfig }).then((data) => {
            return JSON.parse(data);
        });
    },

    async renamePlaylist(path, newName) {
        return await renameFile(path, `Playlists\\${newName}`, { dir: BaseDirectory.AppConfig });
    },

    async deletePlaylist(path) {
        return await removeFile(path, { dir: BaseDirectory.AppConfig });
    },

    getAverageRGB(imgEl) {

        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
            canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain */
            return defaultRGB;
        }

        length = data.data.length;

        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);
        return rgb;

    }

};

export default utils;


// Get rid of annoying warning
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <MainWindow />
    </BrowserRouter>
);