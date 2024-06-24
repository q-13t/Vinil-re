import { useEffect, useRef } from "react";
import { appendSong } from "./utils";

import burgerImg from "/Burger.svg";
import checkImg from "/Check.svg";
import playImg from "/Play.svg";
import plusImg from "/Plus.svg";
import playlistImg from "/Playlist.svg";
import arrowImg from "/Arrows.svg";
import transparentImg from "/Transparent.svg";
import DropDownMenu from "./DropDownMenu";

const Songs_List = ({ providedRef = null, providedDraggableProps = {}, providedDragHandleProps = {}, id, path, odd, observer, checked, setChecked, handlePlayNext, setPlay, playlists, openDialog, currentSong, draggable = false, dragStart = null, dragOver = null, dragEnd = null }) => {
    const ref = useRef(null);

    let updateThisCheck = () => {//Setts the check and adds to checked array
        if (checked.includes(path)) {
            setChecked(checked.filter((item) => item !== path));
        } else {
            setChecked([...checked, path]);
        }
    }


    useEffect(() => {// Intersection Observer
        let target;
        if (ref.current) {
            target = ref.current;
        } else if (providedRef !== null) {
            target = document.getElementById(id);
        }
        // console.log(target);
        if (target) {
            observer.observe(target);
            return () => observer.unobserve(target);
        }
    }, [providedRef, path]);



    let handleNewPlaylist = () => {
        setChecked([path]);
        openDialog(true);
    }

    let handleAddToPlaylist = (p_path) => {
        setChecked([path]);
        appendSong(p_path, [path]).then(() => {
            setChecked([]);
        });
    }

    return (
        <div
            data-path={path}
            id={id}
            ref={providedRef !== null ? providedRef : ref}
            {...providedDraggableProps}
            {...providedDragHandleProps}

            className={`song-el-container-list ${odd ? "odd" : ""}`}
        >
            <div id={`check-${id}`} className="song-el-check" onClick={() => { updateThisCheck() }}>
                <img src={checkImg} style={{ width: "inherit", visibility: checked.includes(path) ? "visible" : "hidden" }} />
            </div>
            <img id={`img-${id}`} className="song-el-album" src={transparentImg} ></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 25%", maxWidth: "25%", alignItems: "center" }}>
                <p id={`title-${id}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <div className="song-button max-height" >
                    <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                </div>
                <DropDownMenu id={id} path={path} playlists={playlists} handleNewPlaylist={handleNewPlaylist} handleAddToPlaylist={handleAddToPlaylist} />
            </div >
            <p id={`artist-${id}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`album-${id}`} className="song-el-album" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`duration-${id}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
        </div >
    );
}


export default Songs_List;