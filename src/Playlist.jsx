import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.svg";
import { getPlaylist, renamePlaylist, getPlaylists, getAverageRGB, savePlaylist, validatePlaylistName, displayPlaylistNameWarning, deletePlaylist } from "./utils";
import Songs_List from "./Songs-List";
import { invoke } from "@tauri-apps/api";
import playlistImg from "./assets/Playlist.svg";

let counter = 0;

const Playlist = ({ setPlaylists, selectedSongs, setSelectedSongs, observer, setCurrentPlaylist, setCurrentSong, currentSong, playlists, navigateTo, setForcePlay, forcePlay }) => {
    const [queryParameters] = useSearchParams();
    let odd = false;
    let path = queryParameters.get("path");
    let [songs, setSongs] = useState([]);
    let [changed, setChanged] = useState(false);
    let [playlistName, setPlaylistName] = useState("");
    let [draggedItemId, setDraggedItemId] = useState(null);

    useEffect(() => {
        counter = 0;
        async function populate() {
            // Read playlist from path
            getPlaylist(path).then(async (entries) => {//get songs
                setSongs(entries);
                let img = document.getElementById("PlayListImage");
                if (entries.length != 0) {
                    await invoke("get_tag", { path: entries[0] }).then((res) => {//get first song image and set it as album cover
                        if (res[3]) img.src = "data:image/webp;base64," + res[3];
                    });
                } else {
                    img.src = playlistImg;
                }
                if (img) {
                    const rgb = getAverageRGB(img);
                    document.getElementById("PlayListTopMenu").style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                }
            });
            setPlaylistName(queryParameters.get("name"));
        }
        populate();
    }, [path]);



    let textAreaChange = (e) => {
        setChanged(true);
        setPlaylistName(e.target.value);
    }

    let saveData = () => {
        if (validatePlaylistName(playlistName) == false) {
            displayPlaylistNameWarning();
            return;
        }
        if (changed) {
            renamePlaylist(path, playlistName).then(() => {
                getPlaylists().then((playlists) => {
                    if (playlists.length > 0) {
                        setPlaylists(playlists);
                    }
                })
            });
        }
        setChanged(false);
    }

    let dragStart = (e) => {
        setDraggedItemId(e);
    }

    let dragOver = (id) => {
        const draggedItem = document.getElementById(draggedItemId);
        const dropTarget = document.getElementById(id);

        if (draggedItem && dropTarget !== draggedItem) {
            // Determine the index of the drop target relative to its siblings
            const dropTargetIndex = Array.from(dropTarget.parentNode.children).indexOf(dropTarget);
            const draggedItemIndex = Array.from(draggedItem.parentNode.children).indexOf(draggedItem);

            // Rearrange the children
            if (dropTargetIndex > draggedItemIndex) {
                dropTarget.parentNode.insertBefore(draggedItem, dropTarget.nextSibling);
            } else {
                dropTarget.parentNode.insertBefore(draggedItem, dropTarget);
            }
        }
    }

    let dragEnd = (id) => {
        const songIds = Array.from(document.getElementById("PlayListContent").children).map(item => item.id);
        setSongs(songIds);
        async function SavePlaylistOrder() {
            savePlaylist(playlistName, songIds);
        }
        async function updateImg() {
            await invoke("get_tag", { path: songIds[0] }).then((res) => {//get first song image and set it as album cover
                if (res[3]) {
                    let img = document.getElementById("PlayListImage");
                    if (img) img.src = "data:image/webp;base64," + res[3];
                    const rgb = getAverageRGB(img);
                    document.getElementById("PlayListTopMenu").style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                }
            });
        }
        updateImg();
        setDraggedItemId(null);
        SavePlaylistOrder();
    }


    let handlePlay = (path) => {
        setForcePlay(!forcePlay);
        setCurrentPlaylist(songs);
        setCurrentSong(path);
        sessionStorage.setItem("currentIndex", songs.indexOf(path));
        localStorage.setItem("currentPlaylist", JSON.stringify(songs));
    }
    let handleDeletePlaylist = (path) => {
        deletePlaylist(path).then(() => {
            getPlaylists().then((playlists) => {
                if (playlists.length > 0) {
                    setPlaylists(playlists);
                }
                document.getElementById("Delete-Playlist-Dialog").close();
                navigateTo("/");
            })
        });
    }
    let handleDeleteFromPlaylist = () => {
        let tmp = songs.filter((item) => !selectedSongs.includes(item));
        setSongs(tmp);
        savePlaylist(playlistName, tmp);
        setSelectedSongs([]);
    }

    let handlePlayNext = (path) => {
        let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist"));
        let currentIndexInPlaylist = currentPlaylist.indexOf(currentSong);
        currentPlaylist.splice(currentIndexInPlaylist + 1, 0, path);
        localStorage.setItem("currentPlaylist", JSON.stringify(currentPlaylist));
        setCurrentPlaylist(currentPlaylist);
    }

    return (
        <div id="Playlist">
            <dialog id="Delete-Playlist-Dialog" style={{ display: "none" }}>
                <div id="Delete-Playlist-Dialog-Container">
                    <p>Are you sure you want to delete this playlist?</p>
                    <div>
                        <button onClick={() => { handleDeletePlaylist(path) }}>Delete</button>
                        <button onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "none" }}>Cancel</button>
                    </div>
                </div>
            </dialog>
            <div id="PlayListTopMenu">
                <div id="PlayListData" className="elem-fade-in-top">
                    <img id="PlayListImage" src={burgerImg} alt="" />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <input type="text" onChange={(e) => textAreaChange(e)} value={playlistName} id="playlistName" />
                            <p id="PlayListDataSave" onClick={() => { saveData() }} style={{ display: changed ? "block" : "none" }}>Save</p>
                        </div>
                        <div id="PlayListControls">
                            <p onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "flex" }}>Delete Playlist</p>
                            <p onClick={handleDeleteFromPlaylist}>Delete From Playlist</p>
                        </div>
                    </div>
                </div>

            </div>
            <div id="PlayListContent" >
                {songs.length != 0 && songs.map((path) => {
                    odd = !odd; counter++;
                    return (<Songs_List id={counter} path={path} handlePlayNext={handlePlayNext} odd={odd} observer={observer} setPlay={handlePlay} currentSong={currentSong} playlists={playlists} checked={selectedSongs} setChecked={setSelectedSongs} draggable={true} dragStart={dragStart} dragOver={dragOver} dragEnd={dragEnd} />);
                })}
            </div>
        </div >
    );
}

export default Playlist;