
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";
import utils from "./main";
import Playlist from "./Playlist";
import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";

async function isIntersecting(entries) {
    entries.forEach((entry) => {
        let id = entry.target.id;
        if (entry.isIntersecting) {
            async function fetchData() {
                const res = await invoke("get_tag", { path: id });
                if (res) {
                    const title = document.getElementById(`title-${id}`);
                    if (title) title.innerHTML = res[0];
                    const artist = document.getElementById(`artist-${id}`);
                    if (artist) artist.innerHTML = res[1];
                    const duration = document.getElementById(`duration-${id}`);
                    if (duration) duration.innerHTML = res[2];
                    const album = document.getElementById(`album-${id}`);
                    if (album) album.innerHTML = res[3];
                    const img = document.getElementById(`img-${id}`);
                    if (img) img.src = res[4] ? "data:image/webp;base64," + res[4] : burgerImg;
                }
            };
            fetchData();
        } else {
            const title = document.getElementById(`title-${id}`);
            if (title) title.innerHTML = null;
            const artist = document.getElementById(`artist-${id}`);
            if (artist) artist.innerHTML = null;
            const duration = document.getElementById(`duration-${id}`);
            if (duration) duration.innerHTML = null;
            const album = document.getElementById(`album-${id}`);
            if (album) album.innerHTML = null;
            const img = document.getElementById(`img-${id}`);
            if (img) img.src = null;
            const created = document.getElementById(`created-${id}`);
            if (created) created.value = null;
        }
    });
}


const MainWindow = () => {
    let [observer, setObserver] = useState(new IntersectionObserver(isIntersecting));
    let [dialog, openDialog] = useState(false);
    let [selectedSongs, setSelectedSongs] = useState([]);
    let [playlists, setPlaylists] = useState([]);

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
                < BrowserRouter >
                    <SideMenu openDialog={openDialog} playlists={playlists} />
                    <Routes>
                        <Route path="/" element={<MainDisplay openDialog={openDialog} playlists={playlists} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} observer={observer} />} ></Route>
                        <Route path="/settings" element={<Settings />} ></Route>
                        <Route path="/playlist" element={<Playlist setPlaylists={setPlaylists} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} observer={observer} />}></Route>
                    </Routes>
                </BrowserRouter >
            </div>
            <PlayerControls />
        </div>
    );
}

export default MainWindow;