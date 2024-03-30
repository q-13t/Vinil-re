import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useRef, useState } from "react";

const Songs_Grid = ({ path, observer }) => {
    const ref = useRef(null);
    // title artist duration album picture


    useEffect(() => {
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
        <div id={path} ref={ref} className="song-el-container-grid" >
            <img id={`img-${path}`} className="song-el-album" src={burgerImg}></img>
            <p id={`title-${path}`} className="song-el-title">Title</p>
            <div style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
                <p id={`artist-${path}`} className="song-el-artist">Artist</p>
                <p id={`duration-${path}`} className="song-el-time">0:00</p>
            </div>

            <div className="song-el-buttons">
                <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
            </div >
        </div >
    );
}

export default Songs_Grid;


