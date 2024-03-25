
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";
import utils from "./main";

const MainWindow = () => {
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
                        <Route path="/" element={<MainDisplay openDialog={openDialog} playlists={playlists} selectedSongs={selectedSongs} setSelectedSongs={setSelectedSongs} />} ></Route>
                        <Route path="/settings" element={<Settings />} ></Route>
                    </Routes>
                </BrowserRouter >
            </div>
            <PlayerControls />
        </div>
    );
}

export default MainWindow;