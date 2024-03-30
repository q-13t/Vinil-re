import { fs, invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useRef, useState } from "react";
import checkImg from "./assets/Check.svg";
import playImg from "./assets/Play.svg";
import plusImg from "./assets/Plus.svg";

const Songs_List = ({ path, odd, observer, checked, setChecked, setPlay, draggable = false, dragStart = null, dragEnd = null }) => {
    const ref = useRef(null);

    let updateThisCheck = () => {//Setts the check and adds to checked array

        if (checked.includes(path)) {
            // document.getElementById(`check-${path}`).style.backgroundImage = `none`;
            setChecked(checked.filter((item) => item !== path));
        } else {
            // document.getElementById(`check-${path}`).style.backgroundImage = `url(${checkImg})`;
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
        <div id={path} ref={ref} className={`song-el-container-list ${odd ? "odd" : ""}`} draggable={draggable} onDragStart={dragStart} onDragEnd={dragEnd} >
            <div id={`check-${path}`} className="song-el-check" style={{ backgroundImage: checked.includes(path) ? `url(${checkImg})` : "none" }} onClick={() => { updateThisCheck() }}></div>
            <img id={`img-${path}`} className="song-el-album"></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 20%", maxWidth: "20%" }}>
                <p id={`title-${path}`} className="song-el-title" ></p>
                <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                <img src={plusImg} alt={burgerImg} className="song-el-add"></img>
            </div >
            <p id={`artist-${path}`} className="song-el-artist">Artist</p>
            <p id={`album-${path}`} className="song-el-album"></p>
            <p id={`duration-${path}`} className="song-el-time"></p>
        </div >
    );
}


export default Songs_List;