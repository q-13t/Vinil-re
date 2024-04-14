import ReactDOM from "react-dom/client";
import "./index.css";
import { BaseDirectory, createDir, exists, readDir, readTextFile, removeFile, removeDir, renameFile, writeFile } from "@tauri-apps/api/fs";
import MainWindow from "./MainWindow";
import { BrowserRouter } from "react-router-dom";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { message } from "@tauri-apps/api/dialog"
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
                return await createDir('Playlists', { dir: BaseDirectory.AppConfig, recursive: true }).then(() => { return [] });
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

    },
    async getAudioDuration(filePath) {
        return new Promise((resolve, reject) => {
            const audio = new Audio(convertFileSrc(filePath));
            audio.onloadedmetadata = () => {
                let minutes = Math.floor(audio.duration / 60);
                let seconds = Math.floor(audio.duration - minutes * 60);
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
                let promises = [];
                promises.push(utils.getAudioMetadata(filePath));
                promises.push(utils.getAudioDuration(filePath));
                return await Promise.all(promises).then(async (values) => {
                    let [[title, artist, album, image, created], { minutes, seconds }] = values;
                    if (image !== "")
                        image = "data:image/webp;base64," + image;
                    if (title === "") title = filename;
                    writeFile(`SongsData\\${filename}.json`, JSON.stringify({ path: filePath, created: created.secs_since_epoch, title, artist, album, duration: `${minutes}:${seconds}`, image, }), { dir: BaseDirectory.AppConfig, recursive: true });
                    let duration = `${minutes}:${seconds}`;
                    if (!indexing)
                        return { title, artist, album, image, duration }; // Return an object with extracted metadata
                    else
                        return { filePath, title, artist, album, duration, created: created.secs_since_epoch };
                });
                // const { minutes, seconds } = await utils.getAudioDuration(filePath);
                // let [title, artist, album, image, created] = await utils.getAudioMetadata(filePath);
                // if (image !== "")
                //     image = "data:image/webp;base64," + image;
                // if (title === "") title = filename;
                // writeFile(`SongsData\\${filename}.json`, JSON.stringify({ path: filePath, created: created.secs_since_epoch, title, artist, album, duration: `${minutes}:${seconds}`, image, }), { dir: BaseDirectory.AppConfig, recursive: true });
                // const duration = `${minutes}:${seconds}`
                // if (!indexing)
                //     return { title, artist, album, image, duration }; // Return an object with extracted metadata
                // else
                //     return { filePath, title, artist, album, duration, created: created.secs_since_epoch };
            }
        })
    },

    async IndexSongs(folders = null) {
        finishedIndexing = false;
        console.log("INDEXING");
        if (folders == null || folders.length == 0) {
            await utils.getFolders().then((paths) => {
                if (paths.length == 0) {
                    return;
                }
                // console.log(paths);
                folders = paths;
            })
        }
        // console.log(folders);
        await invoke("get_paths", { folders: folders, sortBy: "Time Created", searchText: "" }).then(async (paths) => {
            let shortIndex = [];

            shortIndex = await readTextFile("ShortIndex.json", { dir: BaseDirectory.AppConfig }).then((data) => {
                return JSON.parse(data);
            }).catch((err) => {
                console.log(err);
                return [];
            });
            // console.log(paths, shortIndex);
            let progress = document.getElementById("indexing-progress");

            if (shortIndex.length === paths.length) {// No need to index
                finishedIndexing = true;
                return;
            } else if (paths.length > shortIndex.length) {
                let indexedPaths = shortIndex.map(x => { return x.filePath; });
                let temp = 0;
                // let prevPath;
                for (let i = 0; i < paths.length; i++) {
                    if (canaledIndexing) break;
                    try {
                        // console.log("INDEXING", paths[i]);
                        if (!progress) progress = document.getElementById("indexing-progress");
                        progress.value = (i / paths.length) * 100;
                        // if (i > 1) prevPath = paths[i - 1];
                        if (!indexedPaths.includes(paths[i])) {
                            await utils.getTag(paths[i], true).then((res) => {
                                shortIndex.splice(i, 0, res);
                                temp++;
                            })
                        }
                        if (temp === 10) { await writeFile("ShortIndex.json", JSON.stringify(shortIndex), { dir: BaseDirectory.AppConfig, recursive: true }).then(() => { temp = 0; }); }
                    } catch (e) {
                        console.log(e);
                    }


                }
                progress.style.display = "none";
                finishedIndexing = true;
                writeFile("ShortIndex.json", JSON.stringify(shortIndex), { dir: BaseDirectory.AppConfig, recursive: true });
            }

            // async function INDEX(path) {
            //     // console.log("INDEXING:", path);
            //     return new Promise((resolve, reject) => {
            //         invoke("get_tag", { path: path }).then(async (res) => {
            //             const { minutes, seconds } = await utils.getAudioDuration(path);
            //             let [title, artist, album, image, created] = await utils.getAudioMetadata(path);
            //             if (image !== "")
            //                 image = "data:image/webp;base64," + image;
            //             if (title === "") title = filename;
            //             const duration = `${minutes}:${seconds}`
            //             console.log("Resolved: ", path);
            //             resolve({ filePath: path, title, artist, album, duration, created: created.secs_since_epoch });
            //         })

            //     });
            // }

            // canaledIndexing = false;
            // let promises = [];
            // for (let i = 0; i < paths.length; i++) {
            //     promises.push(INDEX(paths[i]));
            // }
            // Promise.all(promises).then((data) => {
            //     sessionStorage.setItem("shortIndex", data);
            //     writeFile('ShortIndex.json', JSON.stringify(data), { dir: BaseDirectory.AppConfig, recursive: true });
            // })

        })

    },
    async clearSongsData() {
        exists("SongsData", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
            if (exists) {
                if (!finishedIndexing) {
                    canaledIndexing = true;
                };
                removeFile("ShortIndex.json", { dir: BaseDirectory.AppConfig });
                removeDir("SongsData", { dir: BaseDirectory.AppConfig, recursive: true }).then(async () => {
                    await message('Cash Cleared!', { title: 'Vinil-re', type: 'info' });
                }).catch((err) => {
                    console.log(err);
                });
            }
        })
    },

    async searchAndSort(sortBy = "Time Created", search = "") {
        console.log(sortBy, search);
        if (finishedIndexing) {// if indexing is finished and all files are created
            let fileData = [];
            if (fileData == null || fileData.length == 0)
                fileData = await readTextFile(`ShortIndex.json`, { dir: BaseDirectory.AppConfig }).then((data) => {
                    return JSON.parse(data);
                }).catch((err) => {
                    console.log(err);
                    return [];
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