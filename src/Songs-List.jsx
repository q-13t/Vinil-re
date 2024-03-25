import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";
import { useEffect, useRef, useState } from "react";
import { logDir } from "@tauri-apps/api/path";

const Songs_List = ({ path, odd, observer, checked, setChecked }) => {
    const ref = useRef(null);


    let updateThisCheck = () => {//Setts the check and adds to checked array

        if (checked.includes(path)) {
            document.getElementById(`check-${path}`).style.backgroundImage = `none`;
            setChecked(checked.filter((item) => item !== path));
        } else {
            document.getElementById(`check-${path}`).style.backgroundImage = `url(${burgerImg})`;
            setChecked([...checked, path]);
        }
    }


    useEffect(() => {// Intersection Observer
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        }
    }, []);

    return (
        <div id={path} ref={ref} className={`song-el-container-list ${odd ? "odd" : ""}`}   >
            <div id={`check-${path}`} className="song-el-check" style={{ backgroundImage: checked.includes(path) ? `url(${burgerImg})` : "none" }} onClick={() => { updateThisCheck() }}></div>
            <img id={`img-${path}`} className="song-el-album"></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 20%", maxWidth: "20%" }}>
                <p id={`title-${path}`} className="song-el-title" ></p>
                <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
            </div >
            <p id={`artist-${path}`} className="song-el-artist">Artist</p>
            <p id={`album-${path}`} className="song-el-album"></p>
            <p id={`duration-${path}`} className="song-el-time"></p>
        </div>
    );
}


export default Songs_List;