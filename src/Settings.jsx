import React, { useEffect, useState } from "react";
import FolderEl from "./FolderEl";
import burgerImg from "./assets/Burger.svg";

import plusImg from "./assets/Plus.svg";
import { open } from '@tauri-apps/api/dialog';
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import utils from "./main";


const Settings = () => {
    let [paths, setPaths] = useState([]);


    useEffect(() => {
        utils.getFolders().then((folders) => {
            setPaths(folders);
        })
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
            utils.IndexSongs(folders);
        };
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
                <img src={plusImg} alt={burgerImg} />
                <p>Where to look for?</p>
            </div>
            <div id="FoldersContainer">
                {paths && paths.map((path) => <FolderEl key={path} path={path} removePath={removePath} />)}
            </div>
        </div >
    );
}


export default Settings;