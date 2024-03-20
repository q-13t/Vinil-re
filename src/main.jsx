import React, { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./SideMenu";
import PlayerControls from "./PlayerControls";
import MainDisplay from "./MainDisplay";
import "./index.css";
import Settings from "./Settings";
import { BaseDirectory, exists, readTextFile, writeFile } from "@tauri-apps/api/fs";

const getFolders = async () => {
    return await exists("folders.json", { dir: BaseDirectory.AppConfig }).then(async (exists) => {
        if (exists) {
            return await readTextFile('folders.json', { dir: BaseDirectory.AppData }).then((data) => {
                return JSON.parse(data);
            })
        } else {
            return await writeFile('folders.json', { dir: BaseDirectory.AppData, recursive: true }).then(() => {
                return [];
            });
        }
    }).catch((err) => {
        console.log(err);
        return [];
    });

}
export default getFolders;

ReactDOM.createRoot(document.getElementById("root")).render(
    // <React.StrictMode>
    <div id="AppContainer">
        <div id="MainContainer">
            < BrowserRouter >
                <SideMenu />
                <Routes>
                    <Route path="/" element={<MainDisplay />} ></Route>
                    <Route path="/settings" element={<Settings />} ></Route>
                    {/* <Route path="/playlist" element={<div></div>} ></Route>
                        <Route path="/playlist/:name" element={<div></div>} ></Route>
                        <Route path="/setting" element={<div></div>} ></Route> */}
                </Routes>
            </BrowserRouter >
        </div>
        <PlayerControls />
    </div>
    // </React.StrictMode>
);