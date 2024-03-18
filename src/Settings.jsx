import React, { createElement, useState } from "react";
import FolderEl from "./FolderEl";
import burgerImg from "./assets/Burger.png";
import { open } from '@tauri-apps/api/dialog';


const Settings = () => {
    let [paths, setPaths] = useState([]);

    const handleInputChange = async (e) => {
        const selected = await open({
            multiple: true,
            directory: true,
        });
        if (Array.isArray(selected)) {// user selected multiple files
            selected.forEach((path) => {
                setPaths((paths) => [...paths, path]);
            })
        } else if (selected === null) {

        } else { // user selected a single file
            console.log(typeof selected, selected);
            setPaths((paths) => [...paths, selected]);
        }
    }

    let removePath = (path) => {
        setPaths((paths) => paths.filter((p) => p !== path));
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