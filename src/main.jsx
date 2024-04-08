import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, createDir, exists, readDir, readTextFile, removeFile, removeDir, renameFile, writeFile } from "@tauri-apps/api/fs";
import MainWindow from "./MainWindow";
import { BrowserRouter } from "react-router-dom";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { message } from "@tauri-apps/api/dialog"
import vinilImg from "./assets/Vinil.svg";
let finishedIndexing = true;
let canaledIndexing = false;

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
            //console.log(err);
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
                return await createDir('Playlists', { dir: BaseDirectory.AppConfig, recursive: true }).then(() => { return [] });
            }
        }).catch((err) => {
            //console.log(err);
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
            //console.log(err);
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

    },
    async getAudioDuration(filePath) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(convertFileSrc(filePath));
            audio.onloadedmetadata = () => {
                let minutes = Math.floor(audio.duration / 60);
                let seconds = Math.floor(audio.duration - minutes * 60);
                minutes = minutes < 10 ? `0${minutes}` : minutes;
                seconds = seconds < 10 ? `0${seconds}` : seconds;
                resolve({ minutes, seconds });
            };
            audio.onerror = (error) => {
                reject(error);
            };
        });
    },
    async getAudioMetadata(filePath) {
        const res = await invoke("get_tag", { path: filePath });
        //console.log(res);
        if (res) {
            return res;
        } else {
            return [];
        }
    },
    async getTag(filePath, indexing) {
        await exists("SongsData", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (!exists) {
                await createDir('SongsData', { dir: BaseDirectory.AppConfig, recursive: true });
            }
        })
        let filename = filePath.match(/([^/\\]*)\.[^/\\]+$/)[0];
        return await exists(`SongsData\\${filename}.json`, { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {

                return await readTextFile(`SongsData\\${filename}.json`, { dir: BaseDirectory.AppConfig }).then((data) => {
                    let json = JSON.parse(data);
                    if (!indexing)
                        return json;
                    else
                        return { filePath: json.path, title: json.title, artist: json.artist, album: json.album, duration: json.duration, created: json.created };
                })
            } else {
                //console.log("READING:" + filename);
                const { minutes, seconds } = await utils.getAudioDuration(filePath);
                let [title, artist, album, image, created] = await utils.getAudioMetadata(filePath);
                if (image === "")
                    image = vinilImg;
                else
                    image = "data:image/webp;base64," + image;
                writeFile(`SongsData\\${filename}.json`, JSON.stringify({ path: filePath, created: created.secs_since_epoch, title, artist, album, duration: `${minutes}:${seconds}`, image, }), { dir: BaseDirectory.AppConfig, recursive: true });
                const duration = `${minutes}:${seconds}`
                if (!indexing)
                    return { title, artist, album, image, duration }; // Return an object with extracted metadata
                else
                    return { filePath, title, artist, album, duration, created: created.secs_since_epoch };
            }
        })
    },

    async IndexSongs(folders) {
        let SongDataExists = await exists("SongsData", { dir: BaseDirectory.AppConfig }).then(async (SongDataExists) => { return SongDataExists; });
        let shortIndexExists = await exists("ShortIndex.json", { dir: BaseDirectory.AppConfig }).then(async (shortIndexExists) => { return shortIndexExists; });
        if ((shortIndexExists && SongDataExists) || !finishedIndexing) return;


        if (folders == null || folders.length == 0) {
            await utils.getFolders().then((paths) => {
                if (paths.length == 0) {
                    return;
                }
                folders = paths;
            })
        }



        finishedIndexing = false;
        if (!SongDataExists) {
            await createDir('SongsData', { dir: BaseDirectory.AppConfig, recursive: true });
        }
        // let shortExists = await exists("ShortIndex.json", { dir: BaseDirectory.AppConfig }).then((exists) => { return exists; });
        // //console.log("Short exists:" + shortExists);
        await invoke("get_paths", { folders: folders, sortBy: "Time Created", searchText: "" }).then((paths) => {
            let els = 0;
            let shortIndex = [];

            async function INDEX(path) {
                console.log("INDEXING:", els);
                await utils.getTag(path, true).then((res) => {
                    shortIndex.push(res);
                }).catch((err) => {
                    //console.log(err);
                })
                els += +1;
                if (els < paths.length && !canaledIndexing) {
                    INDEX(paths[els])
                } else {
                    //console.log("ShortIndex:", shortIndex);
                    writeFile('ShortIndex.json', JSON.stringify(shortIndex), { dir: BaseDirectory.AppConfig, recursive: true });
                }
            }
            canaledIndexing = false;
            INDEX(paths[0]);

        })
        finishedIndexing = true;

    },
    async clearSongsData() {
        exists("SongsData", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {
                if (!finishedIndexing) {
                    canaledIndexing = true;
                };
                removeDir("SongsData", { dir: BaseDirectory.AppConfig, recursive: true }).then(async () => {
                    await message('Cash Cleared!', { title: 'Vinil-re', type: 'info' });
                }).catch((err) => {
                    //console.log(err);
                });
            }
        })
    },

    async searchAndSort(sortBy = "Time Created", search = "") {
        console.log(sortBy, search);
        if (finishedIndexing) {// if indexing is finished and all files are created
            return await readDir('SongsData', { dir: BaseDirectory.AppConfig, recursive: true }).then(async (fileNames) => {
                let fileData = await readTextFile(`ShortIndex.json`, { dir: BaseDirectory.AppConfig }).then((data) => {
                    return JSON.parse(data);
                });
                if (search !== "") {
                    fileData = fileData.filter((el) => { return el.title.toLowerCase().includes(search) || el.artist.toLowerCase().includes(search) || el.album.toLowerCase().includes(search); })
                }
                switch (sortBy) {
                    case "Time Created": {
                        fileData.sort((a, b) => {
                            return b.created - a.created;
                        });
                        break;
                    }
                    case "Title": {
                        fileData.sort((a, b) => {
                            return a.title.localeCompare(b.title);
                        })
                        break;
                    }
                    case "Artist": {
                        fileData.sort((a, b) => {
                            return a.artist.localeCompare(b.artist);
                        })
                        break;
                    }
                }
                return fileData.map((el) => {
                    return el.filePath;
                });

            });
        } else {// if indexing is not finished and all files are not created
            await utils.getFolders().then(async (folders) => {
                await invoke("get_paths", { folders: folders, sortBy, searchText: search }).then((res) => {
                    return res;
                })
            });
        }
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