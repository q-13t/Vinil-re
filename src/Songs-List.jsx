import { fs, invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useRef, useState } from "react";
import checkImg from "./assets/Check.svg";
import playImg from "./assets/Play.svg";
import plusImg from "./assets/Plus.svg";
import playlistImg from "./assets/Playlist.svg";
import utils from "./main";

const Songs_List = ({ path, odd, observer, checked, setChecked, setPlay, playlists, openDialog, currentSong, draggable = false, dragStart = null, dragOver = null, dragEnd = null }) => {
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


    const handleDragStart = (e) => {
        dragStart(path);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dragOver(path);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dragEnd(path);
    };

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
        <div
            id={path}
            ref={ref}
            className={`song-el-container-list ${odd ? "odd" : ""}`}
            draggable={draggable}
            onDragStart={(e) => { handleDragStart(e) }}
            onDragOver={(e) => { handleDragOver(e) }}
            onDrop={(e) => { handleDrop(e) }}
            style={currentSong === path ? { color: "var(--accent-color)" } : {}}
        >
            <div id={`check-${path}`} className="song-el-check" style={{ backgroundImage: checked.includes(path) ? `url(${checkImg})` : "none", color: currentSong === path ? "var(--accent-color)" : "" }} onClick={() => { updateThisCheck() }}></div>
            <img id={`img-${path}`} className="song-el-album"></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 20%", maxWidth: "20%", alignItems: "stretch" }}>
                <p id={`title-${path}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
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
            <p id={`artist-${path}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`album-${path}`} className="song-el-album" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`duration-${path}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
        </div >
    );
}


export default Songs_List;