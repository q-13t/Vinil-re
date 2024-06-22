import React, { useEffect, useState } from "react";
import FolderEl from "./FolderEl";
import burgerImg from "/Burger.svg";

import plusImg from "/Plus.svg";
import { open } from '@tauri-apps/api/dialog';
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { getFolders, IndexSongs, clearSongsData, updateFileWatchers } from "./utils";


const Settings = () => {
    let [paths, setPaths] = useState([]);


    useEffect(() => {
        getFolders().then((folders) => {
            setPaths(folders);
        })
        updateFileWatchers();
        let visualizer_select = document.getElementById(`visualizer-select`);
        let visualizer = localStorage.getItem("visualizer");
        if (visualizer && visualizer_select) {
            visualizer_select.value = visualizer;
        }
    }, []);


    const handleInputChange = async (e) => {
        const selected = await open({
            multiple: true,
            directory: true,
        });
        if (Array.isArray(selected)) {
            let folders = [...paths, ...selected.map((path) => path)];
            setPaths(folders);
            writeTextFile('folders.json', JSON.stringify(folders), { dir: BaseDirectory.AppData, encoding: 'utf-8' });
            IndexSongs(folders);
            updateFileWatchers();
        };
    }

    let removePath = (path) => {
        let arr = paths.filter((p) => p !== path)
        writeTextFile('folders.json', JSON.stringify(arr), { dir: BaseDirectory.AppData, encoding: 'utf-8' });
        setPaths(arr);
        updateFileWatchers();
        IndexSongs(arr);
    }
    let handleClearCash = () => {
        clearSongsData();
        document.getElementById("ClearCashDialog").style.display = "none";
    }

    let handleVisualizerOptionChange = (e) => {
        console.log("[handleVisualizerOptionChange] value:", e.target.value);
        localStorage.setItem("visualizer", e.target.value);
    }
    return (
        <div id="Settings">
            <dialog id="ClearCashDialog">
                <div id="ClearCashDialogContainer">
                    <p>Are you sure?</p>
                    <div>
                        <button onClick={() => { handleClearCash() }}>Yes</button>
                        <button onClick={() => { document.getElementById("ClearCashDialog").style.display = "none" }}>No</button>
                    </div>
                </div>
            </dialog>
            <h3>Settings</h3>
            <div className="settings-container">
                <div className="misc-container">
                    <p>Visualizer Visibility</p>
                    <select id="visualizer-select" name="visualizer-select" defaultValue={"Always On"} onChange={(e) => { handleVisualizerOptionChange(e) }}>
                        <option value="Always Off">Always Off</option>
                        <option value="On Window Focus">On Window Focus</option>
                        <option value="Always On">Always On</option>
                    </select>
                </div>
                <div className="folder-container">
                    <div id="AddFolderContainer" onClick={() => { handleInputChange() }}>
                        <img src={plusImg} alt={burgerImg} />
                        <p>Where to look for?</p>
                    </div>
                    <p id="ClearCash" onClick={() => { document.getElementById("ClearCashDialog").style.display = "flex" }}>Clear Cash</p>
                    <div id="FoldersContainer">
                        {paths && paths.map((path) => <FolderEl key={path} path={path} removePath={removePath} />)}
                    </div>
                </div>
            </div>

        </div >
    );
}


export default Settings;