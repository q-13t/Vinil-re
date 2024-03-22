
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import Settings from "./Settings";
import NewPlayListDialog from "./NewPlaylistDialog";

const MainWindow = () => {
    let [dialog, openDialog] = useState(false);
    return (
        <div id="AppContainer">
            <NewPlayListDialog open={dialog} openDialog={openDialog} />

            <div id="MainContainer">
                < BrowserRouter >
                    <SideMenu openDialog={openDialog} />
                    <Routes>
                        <Route path="/" element={<MainDisplay />} ></Route>
                        <Route path="/settings" element={<Settings />} ></Route>
                    </Routes>
                </BrowserRouter >
            </div>
            <PlayerControls />
        </div>
    );
}

export default MainWindow;