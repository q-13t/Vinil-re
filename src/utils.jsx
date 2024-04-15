
import { BaseDirectory, createDir, exists, readDir, readTextFile, removeFile, removeDir, renameFile, writeFile } from "@tauri-apps/api/fs";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";
import { message } from "@tauri-apps/api/dialog"
let finishedIndexing = true;
let canaledIndexing = false;

/**
 * A utility collection for common tasks.
 * 
 * - `getFolders()`: Returns array of folders user added to list the music from
 * - `getPlaylists()`: Returns array of playlist names
 * - `getPlaylist(path)`: Returns array of song paths
 * - `savePlaylist(name, entries)`: Saves array of song paths to a playlist
 * - `appendSong(path, entries)`: Appends array of song paths to a playlist
 * - `deletePlaylist(path)`: Deletes a playlist
 * - `renamePlaylist(path, newName)`: Renames a playlist
 * - `IndexSongs(folders = null)`: Starts the indexing process
 * - `searchAndSort(sortBy = "Time Created", search = "")`: Searches and sorts among already indexed songs
 */


/**
 * Returns array of folders user added to list the music from
 * @returns {Promise<Array<String>>}
 */
async function getFolders() {
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
};



/**
 * Returns array of playlist names
 * @returns {Promise<Array<String>>}
 */
async function getPlaylists() {
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
}

/**
 * Saves array of songs to the playlist.
 * If File already exists it will be overwritten.
 * 
 * @param {String} name name of the playlist
 * @param {Array<String>} entries array of song paths
 * @returns {Promise<void>}
 */
async function savePlaylist(name, entries) {
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

};

/**Appends array of songs to the playlist
 * 
 * @param {String} PlaylistPath path to the playlist
 * @param {Array<String>} songsToAdd array of song paths
 * @returns {Promise<void>}
 */
async function appendSong(PlaylistPath, songsToAdd) {
    return await getPlaylist(PlaylistPath).then(async (entries) => {
        return await writeFile(`${PlaylistPath}`, JSON.stringify(entries.concat(songsToAdd)), { dir: BaseDirectory.AppConfig, recursive: true });
    })
};

/**
 * 
 * @param {String} path a valid path to the playlist
 * @returns {Promise<Array<filePath:String>>}
 */
async function getPlaylist(path) {
    return await readTextFile(`${path}`, { dir: BaseDirectory.AppConfig }).then((data) => {
        return JSON.parse(data);
    });
};
/**
 * Renames a playlist file
 * @param {String} path path to the playlist
 * @param {String} newName new name
 * @returns {Promise<void>}
 */
async function renamePlaylist(path, newName) {
    return await renameFile(path, `Playlists\\${newName}`, { dir: BaseDirectory.AppConfig });
};

/**
 * Deletes a playlist file
 * @param {String} path path to the playlist
 * @returns {Promise<void>}
 */
async function deletePlaylist(path) {
    return await removeFile(path, { dir: BaseDirectory.AppConfig });
};

/**Gets the average color of an image
 * 
 * @param {HTMLImageElement} imgEl an image element
 * @returns (r: number, g: number, b: number)
 */
function getAverageRGB(imgEl) {

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
};
/**
 * Returns the duration of an audio file in minutes and seconds. In format `m:ss`
 * @param {String} filePath a valid path to the mp3 file
 * @returns {Promise<{minutes: Number, seconds: Number}>}
 */
async function getAudioDuration(filePath) {
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
};
/**Invokes `get_tag` from Rust
 * 
 * @param {String} filePath a valid path to the mp3 file
 * @returns {Promise<{title: String, artist: String, album: String, image: String, created: String}>}
 */
async function getAudioMetadata(filePath) {
    const res = await invoke("get_tag", { path: filePath });
    //console.log(res);
    if (res) {
        return res;
    } else {
        return [];
    }
};
/**
 * Checks if a file containing data exists, if so returns the data from it, if not invokes `get_tag` from Rust.
 * 
 * @param {String} filePath valid path to the mp3 file
 * @param {Boolean} indexing wether to index or not
 * @returns   if `indexing` is true, returns {Promise<{filePath: String, title: String, artist: String, album: String, duration: String, created: String}>} if `indexing` is false, returns {Promise<{title: String, artist: String, album: String, duration: String, created: String}>}
*/
async function getTag(filePath, indexing) {
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
            promises.push(getAudioMetadata(filePath));
            promises.push(getAudioDuration(filePath));
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
        }
    })
};

/**
 * Starts the indexing process, if it's not already running.
 * If new song is detected it will be indexed and ShortIndex.json will be updated.
 * 
 * 
 * @param {Array<String>} folders folders containing the songs
 */
async function IndexSongs(folders = null) {
    finishedIndexing = false;
    console.log("INDEXING");
    if (folders == null || folders.length == 0) {
        await getFolders().then((paths) => {
            if (paths.length == 0) {
                return;
            }
            folders = paths;
        })
    }
    await invoke("get_paths", { folders: folders, sortBy: "Time Created", searchText: "" }).then(async (paths) => {
        let shortIndex = [];

        shortIndex = await readTextFile("ShortIndex.json", { dir: BaseDirectory.AppConfig }).then((data) => {
            return JSON.parse(data);
        }).catch((err) => {
            console.log(err);
            return [];
        });
        let progress = document.getElementById("indexing-progress");

        if (shortIndex.length === paths.length) {// No need to index
            finishedIndexing = true;
            return;
        } else if (paths.length > shortIndex.length) {
            let indexedPaths = shortIndex.map(x => { return x.filePath; });
            let temp = 0;
            for (let i = 0; i < paths.length; i++) {
                if (canaledIndexing) break;
                try {
                    // console.log("INDEXING", paths[i]);
                    if (!progress) progress = document.getElementById("indexing-progress");
                    progress.value = (i / paths.length) * 100;
                    if (!indexedPaths.includes(paths[i])) {
                        await getTag(paths[i], true).then((res) => {
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
    })

};

/**
 * Clears cash
 * Removes all songs data and short index.
 */
async function clearSongsData() {
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
};

/**
 * Searches and sorts among already indexed songs
 * 
 * @param {String} sortBy sorting string "Time Created" | "Title" | "Artist" -> default "Time Created"
 * @param {String} search String to search in title, artist, album -> default ""
 * @returns array of song paths 
 * @example
 * const paths = await searchAndSort("Title", "s");
 */
async function searchAndSort(sortBy = "Time Created", search = "") {
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
        await getFolders().then(async (folders) => {
            await invoke("get_paths", { folders: folders, sortBy, searchText: search }).then((res) => {
                return res;
            })
        });
    }
}


export { getAverageRGB, searchAndSort, clearSongsData, getTag, getFolders, getPlaylists, getPlaylist, savePlaylist, appendSong, deletePlaylist, renamePlaylist, IndexSongs };
