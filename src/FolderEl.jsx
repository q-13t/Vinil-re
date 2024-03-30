import { useState } from "react";
import burgerImg from "./assets/Burger.svg";

const FolderEl = ({ path, removePath }) => {
    return (
        <div className="Folder" id={`${path}`}>
            <img src={burgerImg} alt={burgerImg} onClick={() => removePath(path)} />
            <input type="text" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
    );
}

export default FolderEl;