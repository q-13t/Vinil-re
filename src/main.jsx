import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainSongList from "./MainSongLIst";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <div id="AppContainer">
        <div id="MainContainer">
            <SideMenu />
            < BrowserRouter >
                <Routes>
                    <Route path="/" element={<MainSongList />} ></Route>
                </Routes>
            </BrowserRouter >
        </div>
        <PlayerControls />
    </div>
);
