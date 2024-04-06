import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useRef, useState } from "react";
import playImg from "./assets/Play.svg";
import plusImg from "./assets/Plus.svg";
import playlistImg from "./assets/Playlist.svg";
import utils from "./main";

const Songs_Grid = ({ path, observer, openDialog, playlists, setPlay, currentSong, setChecked }) => {
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
    let handleNewPlaylist = () => {
        setChecked([path]);
        openDialog(true);
    }

    let handleAddToPlaylist = (p_path) => {
        setChecked([path]);
        utils.appendSong(p_path, [path]).then(() => {
            setChecked([]);
        });
    }
    return (
        <div id={path} ref={ref} className="song-el-container-grid" >
            <img id={`img-${path}`} className="song-el-album" src={burgerImg}></img>
            <p id={`title-${path}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <div style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
                <p id={`artist-${path}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <p id={`duration-${path}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            </div>

            <div className="song-el-buttons">
                <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                <div className="dropdown">
                    <img src={plusImg} alt={burgerImg} className="song-el-add max-height" ></img>
                    <div id={`song-el-add-control-${path}`} className="song-el-add-control">
                        <div className="dropdown-playlist dropdown-el" style={{ borderBottom: "1px solid var(--border-color)" }} onClick={handleNewPlaylist}>
                            <img src={plusImg} alt="" />
                            <p>Create New Playlist</p>
                        </div>
                        {playlists && playlists.map((playlist) => (
                            <div className="dropdown-playlist dropdown-el" key={playlist.name} onClick={() => { handleAddToPlaylist(playlist.path) }}>
                                <img src={playlistImg} ></img>
                                <p>{playlist.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div >
        </div >
    );
}

export default Songs_Grid;


