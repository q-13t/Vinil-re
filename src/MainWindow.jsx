
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, json } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";
import utils from "./main";
import Playlist from "./Playlist";
import burgerImg from "./assets/Burger.svg";


async function isIntersecting(entries) {
    async function intersect() {
        entries.forEach((entry) => {
            let id = entry.target.id;
            const title = document.getElementById(`title-${id}`);
            if (entry.isIntersecting && title.innerHTML === "") {// if there is no data in -> populate
                const img = document.getElementById(`img-${id}`);
                const album = document.getElementById(`album-${id}`);
                const artist = document.getElementById(`artist-${id}`);
                const duration = document.getElementById(`duration-${id}`);
                async function fetchData() {
                    utils.getTag(id, false).then((res) => {
                        if (title) title.innerHTML = res.title;
                        if (artist) artist.innerHTML = res.artist;
                        if (album) album.innerHTML = res.album;
                        if (img) img.src = res.image.startsWith("data:image/webp;base64,") ? res.image : "data:image/webp;base64," + res.image;
                        if (duration) duration.innerHTML = res.duration;
                    })

                };
                fetchData();
            }
        });
    }
    intersect();
}

//  document.addEventListener('contextmenu', event => event.preventDefault()); //Forbid RightClick actions on whole page


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

        utils.IndexSongs(null);

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