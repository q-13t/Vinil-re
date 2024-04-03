
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, json } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";
import utils from "./main";
import Playlist from "./Playlist";
import burgerImg from "./assets/Burger.svg";
import { convertFileSrc, invoke } from "@tauri-apps/api/tauri";


async function isIntersecting(entries) {
    async function intersect() {
        entries.forEach((entry) => {
            let id = entry.target.id;
            if (entry.isIntersecting) {
                async function fetchData() {
                    const duration = document.getElementById(`duration-${id}`);
                    if (duration && duration.innerHTML === "") {
                        let audio = new Audio(convertFileSrc(id));
                        audio.onloadedmetadata = function () {// I wish not to do it this way, but can't make Rust read the duration :[
                            let minutes = Math.floor(audio.duration / 60);
                            let seconds = Math.floor(audio.duration - minutes * 60);
                            duration.innerHTML = minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
                        };
                    }
                    const res = await invoke("get_tag", { path: id });
                    if (res) {
                        const title = document.getElementById(`title-${id}`);
                        if (title) title.innerHTML = res[0];
                        const artist = document.getElementById(`artist-${id}`);
                        if (artist) artist.innerHTML = res[1];
                        const album = document.getElementById(`album-${id}`);
                        if (album) album.innerHTML = res[2];
                        const img = document.getElementById(`img-${id}`);
                        if (img) img.src = res[3] ? "data:image/webp;base64," + res[3] : burgerImg;
                    }
                };
                fetchData();
            } else {
                const img = document.getElementById(`img-${id}`);
                if (img) img.src = null;
            }
        });
    }
    intersect();
}


const MainWindow = () => {
    let [observer, setObserver] = useState(new IntersectionObserver(isIntersecting));
    let [dialog, openDialog] = useState(false);
    let [selectedSongs, setSelectedSongs] = useState([]);
    let [playlists, setPlaylists] = useState([]);
    let [currentPlaylist, setCurrentPlaylist] = useState(JSON.parse(localStorage.getItem("currentPlaylist")));
    let [history, setHistory] = useState([]);
    let [currentSong, setCurrentSong] = useState(localStorage.getItem("currentSong"));
    let navigateTo = useNavigate();
    let [forcePlay, setForcePlay] = useState(false);

    useEffect(() => {
        utils.getPlaylists().then((playlists) => {
            if (playlists.length > 0) {
                setPlaylists(playlists);
            }
        })

    }, []);
    return (
        <div id="AppContainer">
            <NewPlayListDialog open={dialog} openDialog={openDialog} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} setPlaylists={setPlaylists} />

            <div id="MainContainer">

                <SideMenu openDialog={openDialog} playlists={playlists} navigateTo={navigateTo} />
                <Routes>
                    <Route path="/" element={<MainDisplay openDialog={openDialog} playlists={playlists} history={history} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} observer={observer} currentPlaylist={currentPlaylist} setCurrentPlaylist={setCurrentPlaylist} setCurrentSong={setCurrentSong} currentSong={currentSong} forcePlay={forcePlay} setForcePlay={setForcePlay} />} ></Route>
                    <Route path="/settings" element={<Settings />} ></Route>
                    <Route path="/playlist" element={<Playlist setPlaylists={setPlaylists} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} observer={observer} setCurrentPlaylist={setCurrentPlaylist} setCurrentSong={setCurrentSong} currentSong={currentSong} playlists={playlists} navigateTo={navigateTo} forcePlay={forcePlay} setForcePlay={setForcePlay} />}></Route>
                </Routes>

            </div>
            <PlayerControls currentSong={currentSong} setCurrentSong={setCurrentSong} currentPlaylist={currentPlaylist} history={history} setHistory={setHistory} forcePlay={forcePlay} />
        </div>
    );
}

export default MainWindow;