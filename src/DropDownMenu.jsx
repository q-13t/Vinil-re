import plusImg from "/Plus.svg";
import playlistImg from "/Playlist.svg";
import arrowImg from "/Arrows.svg";
import burgerImg from "/Burger.svg";
import { appendSong } from "./utils";
import { useEffect, useState } from "react";

// 1. user hovers the plus button
// 2. dropdown setts the path (e.i. song to be added)
// 3. dropdown checks boundaries and adjusts position if needed
// 4. controls become visible
// 
// Needs:
// common function to be called on hover
// event target
// songs path
// 
// Requirements:
// should not rerender unnecessarily
// should not be visible until hovered
// 
// 


const DropDownMenu = ({ hovered_song, playlists, openDialog, setChecked, handlePlayNext, checkBoundaries }) => {
    let handleNewPlaylist = () => {
        setChecked([hovered_song]);
        openDialog(true);
    }

    let handleAddToPlaylist = (p_path) => {
        setChecked([hovered_song]);
        appendSong(p_path, [hovered_song]).then(() => {
            setChecked([]);
        });
    }
    console.log(hovered_song);

    let unHover = (e) => {
        checkBoundaries(e, null);
        e.target.scrollTop = 0;
    }


    return (
        <div id={`song-el-add-control`} className="song-el-add-control" onMouseLeave={(e) => { unHover(e); }} >
            <div className="dropdown-control "  >
                <div className=" dropdown-playlist dropdown-el" onClick={handleNewPlaylist}>
                    <img src={plusImg} alt="" />
                    <p>Create New Playlist</p>
                </div>
                <div className="dropdown-playlist dropdown-el" onClick={() => { handlePlayNext(hovered_song) }}>
                    <img src={arrowImg} alt="" />
                    <p>Play Next</p>
                </div>
            </div>
            {playlists && playlists.map((playlist) => (
                <div className="dropdown-playlist dropdown-el" key={playlist.name} onClick={() => { handleAddToPlaylist(playlist.path) }}>
                    <img src={playlistImg} ></img>
                    <p>{playlist.name}</p>
                </div>
            ))}
        </div>
    );
}

export default DropDownMenu;