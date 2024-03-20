import React, { createElement, useEffect, useState } from "react";
import FolderEl from "./FolderEl";
import burgerImg from "./assets/Burger.png";
import { open } from '@tauri-apps/api/dialog';
import { BaseDirectory, createDir, exists, readDir, readTextFile, writeFile, writeTextFile } from "@tauri-apps/api/fs";
import { path } from "@tauri-apps/api";
import getFolders from "./main";


const Settings = () => {
    let [paths, setPaths] = useState([]);


    useEffect(() => {
        getFolders().then((folders) => {
            setPaths(folders);
        })
    }, []);


    const handleInputChange = async (e) => {
        const selected = await open({
            multiple: true,
            directory: true,
        });
        if (Array.isArray(selected)) {
            let arr = [...paths, ...selected.map((path) => path)];
            setPaths(arr);
            writeTextFile('folders.json', JSON.stringify(arr), { dir: BaseDirectory.AppData, encoding: 'utf-8' });
        }
    }

    let removePath = (path) => {
        let arr = paths.filter((p) => p !== path)
        writeTextFile('folders.json', JSON.stringify(arr), { dir: BaseDirectory.AppData, encoding: 'utf-8' });
        setPaths(arr);
    }

    return (
        <div id="Settings">
            <h3>Settings</h3>
            <div id="AddFolderContainer" onClick={() => { handleInputChange() }}>
                <img src={burgerImg} alt={burgerImg} />
                <p>Where to look for?</p>
            </div>
            <div id="FoldersContainer">
                {paths && paths.map((path) => <FolderEl path={path} removePath={removePath} />)}
            </div>
        </div >
    );
}

export default Settings;