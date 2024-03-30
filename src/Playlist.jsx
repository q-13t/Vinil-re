import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.svg";
import utils from "./main";
import Songs_List from "./Songs-List";
import { invoke } from "@tauri-apps/api";
import playlistImg from "./assets/Playlist.svg";

// TODO: Implement song altering


const Playlist = ({ setPlaylists, selectedSongs, setSelectedSongs, observer, setCurrentPlaylist, setCurrentSong, navigateTo }) => {
    const [queryParameters] = useSearchParams();
    let odd = false;
    let path = queryParameters.get("path");
    let [songs, setSongs] = useState([]);
    let [changed, setChanged] = useState(false);
    let [playlistName, setPlaylistName] = useState("");
    let [dragIndex, setDragIndex] = useState("");


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

        setDragIndex(e.target.id);

        console.log("dragStart", dragIndex);
    }
    let dragEnd = (e) => {

        console.log(e.target.id, dragIndex);
    }

    let playlistChange = (path) => {
        setCurrentPlaylist(songs);
        setCurrentSong(path);
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
                        <button onClick={() => { document.getElementById("Delete-Playlist-Dialog").close() }}>Cancel</button>
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
            <div id="PlayListContent" onDragEnter={(e) => e.preventDefault()} onDragEnd={dragEnd} >
                {songs.length != 0 && songs.map((song) => {
                    odd = !odd; return <Songs_List key={song} path={song} odd={odd} observer={observer} setPlay={playlistChange} checked={selectedSongs} setChecked={setSelectedSongs} draggable={true} dragStart={dragStart} dragend={dragEnd} />;
                })}
            </div>
        </div >
    );
}

export default Playlist;