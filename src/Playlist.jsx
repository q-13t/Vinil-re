import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.svg";
import utils from "./main";
import Songs_List from "./Songs-List";
import { invoke } from "@tauri-apps/api";
import playlistImg from "./assets/Playlist.svg";


const Playlist = ({ setPlaylists, selectedSongs, setSelectedSongs, observer, setCurrentPlaylist, setCurrentSong, navigateTo }) => {
    const [queryParameters] = useSearchParams();
    let odd = false;
    let path = queryParameters.get("path");
    let [songs, setSongs] = useState([]);
    let [changed, setChanged] = useState(false);
    let [playlistName, setPlaylistName] = useState("");
    let [draggedItemId, setDraggedItemId] = useState(null);

    useEffect(() => {
        async function populate() {
            // Read playlist from path
            utils.getPlaylist(path).then(async (entries) => {//get songs
                setSongs(entries);
                if (entries.length != 0) {
                    await invoke("get_tag", { path: entries[0] }).then((res) => {//get first song image and set it as album cover
                        if (res[3]) {
                            let img = document.getElementById("PlayListImage");
                            if (img) img.src = "data:image/webp;base64," + res[3];
                        }
                    })
                } else {
                    document.getElementById("PlayListImage").src = playlistImg;
                }
            });
            setPlaylistName(queryParameters.get("name"));
        }
        populate();
    }, [path]);


    let textAreaChange = (e) => {
        setChanged(true);
        console.log(e.target.value);
        setPlaylistName(e.target.value);
    }

    let saveData = () => {
        console.log(playlistName);
        if (changed) {
            utils.renamePlaylist(path, playlistName).then(() => {
                utils.getPlaylists().then((playlists) => {
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
            utils.savePlaylist(playlistName, songIds);
        }
        setDraggedItemId(null);
        SavePlaylistOrder();
    }


    let playlistChange = (path) => {
        setCurrentPlaylist(songs);
        setCurrentSong(path);
        localStorage.setItem("currentPlaylist", JSON.stringify(songs));
    }
    let deletePlaylist = (path) => {
        utils.deletePlaylist(path).then(() => {
            utils.getPlaylists().then((playlists) => {
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
        utils.savePlaylist(playlistName, tmp);
        setSelectedSongs([]);
    }

    return (
        <div id="Playlist">
            <dialog id="Delete-Playlist-Dialog" style={{ display: "none" }}>
                <div id="Delete-Playlist-Dialog-Container">
                    <p>Are you sure you want to delete this playlist?</p>
                    <div>
                        <button onClick={() => { deletePlaylist(path) }}>Delete</button>
                        <button onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "none" }}>Cancel</button>
                    </div>
                </div>
            </dialog>
            <div id="PlayListTopMenu">
                <div id="PlayListData">
                    <img id="PlayListImage" src={burgerImg} alt="" />
                    <input type="text" onChange={(e) => textAreaChange(e)} value={playlistName} id="playlistName" />
                    <p id="PlayListDataSave" onClick={() => { saveData() }} style={{ display: changed ? "block" : "none" }}>Save</p>

                </div>
                <div id="PlayListControls">
                    <p onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "flex" }}>Delete Playlist</p>
                    <p onClick={handleDeleteFromPlaylist}>Delete From Playlist</p>
                </div>
            </div>
            <div id="PlayListContent" >
                {songs.length != 0 && songs.map((path) => {
                    odd = !odd;
                    return (<Songs_List key={path} path={path} odd={odd} observer={observer} setPlay={playlistChange} checked={selectedSongs} setChecked={setSelectedSongs} draggable={true} dragStart={dragStart} dragOver={dragOver} dragEnd={dragEnd} />);
                })}
            </div>
        </div >
    );
}

export default Playlist;