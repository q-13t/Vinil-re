import { useState } from "react";
import burgerImg from "./assets/Burger.png";

const FolderEl = ({ path }) => {
    let [pathState, setPath] = useState(path === null ? "" : path);
    return (
        <div className="Folder">
            <img src={burgerImg} alt={burgerImg} srcset="" />
            <img src={burgerImg} alt={burgerImg} srcset="" />
            <input type="text" value={pathState} onChange={(e) => setPath(e.target.value)} />
        </div>
    );
}

export default FolderEl;