import { useEffect, useRef } from "react";


import burgerImg from "/Burger.svg";
import playImg from "/Play.svg";

import transparentImg from "/Transparent.svg";
import DropDownMenu from "./DropDownMenu";

const Songs_Grid = ({ path, id, observer, openDialog, playlists, handlePlayNext, setPlay, currentSong, setChecked }) => {
    const ref = useRef(null);


    useEffect(() => {
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        }
    }, [path]);


    return (
        <div data-path={path} id={id} ref={ref} className="song-el-container-grid" >
            <span>
                <img id={`img-${id}`} className="song-el-album" src={transparentImg} ></img>
            </span>
            <p id={`title-${id}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <div className="song-el-grid-sub">
                <p id={`artist-${id}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <p id={`duration-${id}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            </div>

            <div className="song-el-buttons">
                <div className="song-button ">
                    <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                </div>
                <DropDownMenu id={id} path={path} playlists={playlists} openDialog={openDialog} setChecked={setChecked} handlePlayNext={handlePlayNext} />
            </div >
        </div >
    );
}

export default Songs_Grid;


