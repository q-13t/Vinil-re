
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, json } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";
import { getTag, getPlaylists, IndexSongs, updateFileWatchers, setUIMode } from "./utils";
import Playlist from "./Playlist";
import vinilImg from "/Vinil.svg";
import transparentImg from "/Transparent.svg";


async function isIntersecting(entries) {
    async function intersect() {
        entries.forEach((entry) => {
            let id = entry.target.id;
            let path = entry.target.getAttribute("data-path");
            const title = document.getElementById(`title-${id}`);
            const img = document.getElementById(`img-${id}`);
            const album = document.getElementById(`album-${id}`);
            const artist = document.getElementById(`artist-${id}`);
            const duration = document.getElementById(`duration-${id}`);
            if (entry.isIntersecting) {
                async function fetchData() {
                    getTag(path, false).then((res) => {
                        if (img) {
                            if (res.image !== "")
                                img.src = res.image;
                            else
                                img.src = vinilImg;
                        }
                        if (title) title.innerHTML = res.title;
                        if (artist) artist.innerHTML = res.artist;
                        if (album) album.innerHTML = res.album;
                        if (duration) duration.innerHTML = res.duration;
                        entry.target.classList.add("elem-fade-in-top");
                    });
                };
                fetchData();
            } else {
                if (title) title.innerHTML = "";
                if (artist) artist.innerHTML = "";
                if (album) album.innerHTML = "";
                if (img) img.src = transparentImg;
                if (duration) duration.innerHTML = "";
                entry.target.classList.remove("elem-fade-in-top");
            }
        });
    }
    intersect();
}

// document.addEventListener('contextmenu', event => event.preventDefault()); //Forbid RightClick actions on whole page


const MainWindow = () => {
    let [observer] = useState(new IntersectionObserver(isIntersecting));
    let [dialog, openDialog] = useState(false);
    let [selectedSongs, setSelectedSongs] = useState([]);
    let [playlists, setPlaylists] = useState([]);
    let [currentPlaylist, setCurrentPlaylist] = useState(JSON.parse(localStorage.getItem("currentPlaylist")));
    let [history, setHistory] = useState([]);
    let [currentSong, updateCurrentSong] = useState(localStorage.getItem("currentSong"));
    let navigateTo = useNavigate();
    let [forcePlay, setForcePlay] = useState(false);
    let [display, setDisplay] = useState("My Music");
    let [as, setAs] = useState("list");

    let setCurrentSong = (path) => {
        updateCurrentSong(path);
        if (path === currentSong) {
            setForcePlay(!forcePlay);
        }
    }

    useEffect(() => {
        getPlaylists().then((playlists) => {
            if (playlists.length > 0) {
                setPlaylists(playlists);
            }
        })
        IndexSongs(null);
        updateFileWatchers();
        setUIMode(localStorage.getItem("UI Mode") ?? "Dark");

    }, []);
    return (
        <div id="AppContainer">
            <NewPlayListDialog open={dialog} openDialog={openDialog} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} setPlaylists={setPlaylists} />
            <div id="MainContainer">
                <SideMenu openDialog={openDialog} playlists={playlists} navigateTo={navigateTo} setDisplay={setDisplay} />
                <Routes>
                    <Route path="/" element={<MainDisplay as={as} setAs={setAs} openDialog={openDialog} playlists={playlists} display={display} history={history} selectedSongs={selectedSongs} setCurrentPlaylist={setCurrentPlaylist} setSelectedSongs={setSelectedSongs} observer={observer} setCurrentSong={setCurrentSong} currentSong={currentSong} forcePlay={forcePlay} setForcePlay={setForcePlay} />} ></Route>
                    <Route path="/settings" element={<Settings />} ></Route>
                    <Route path="/playlist" element={<Playlist openDialog={openDialog} setPlaylists={setPlaylists} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} setCurrentPlaylist={setCurrentPlaylist} observer={observer} setCurrentSong={setCurrentSong} currentSong={currentSong} playlists={playlists} navigateTo={navigateTo} forcePlay={forcePlay} setForcePlay={setForcePlay} />}></Route>
                </Routes>
            </div>
            <PlayerControls currentSong={currentSong} setCurrentSong={setCurrentSong} history={history} setHistory={setHistory} forcePlay={forcePlay} currentPlaylist={currentPlaylist} />
        </div>
    );
}

export default MainWindow;