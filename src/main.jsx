import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <div id="AppContainer">
            <div id="MainContainer">
                <SideMenu />
                < BrowserRouter >
                    <Routes>
                        <Route path="/" element={<MainDisplay />} ></Route>
                        {/* <Route path="/playlist" element={<div></div>} ></Route>
                        <Route path="/playlist/:name" element={<div></div>} ></Route>
                        <Route path="/setting" element={<div></div>} ></Route> */}
                    </Routes>
                </BrowserRouter >
            </div>
            <PlayerControls />
        </div>
    </React.StrictMode>
);
