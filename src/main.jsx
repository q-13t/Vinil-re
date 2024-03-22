import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, exists, readDir, readTextFile, writeFile } from "@tauri-apps/api/fs";
import MainWindow from "./MainWindow";
const funcs = {
    async getFolders() {
        return await exists("folders.json", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {
                return await readTextFile('folders.json', { dir: BaseDirectory.AppData }).then((data) => {
                    return JSON.parse(data);
                })
            } else {
                return await writeFile('folders.json', { dir: BaseDirectory.AppData, recursive: true }).then(() => {
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
                return await readDir('Playlists', { dir: BaseDirectory.AppData, recursive: true }).then((entries) => {
                    return entries;
                });
            } else {
                return await createDir('Playlists', { dir: BaseDirectory.AppData, recursive: true });
            }
        }).catch((err) => {
            console.log(err);
            return [];
        });
    }

};

export default funcs;


ReactDOM.createRoot(document.getElementById("root")).render(<MainWindow />);