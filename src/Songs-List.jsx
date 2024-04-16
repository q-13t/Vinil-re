import burgerImg from "./assets/Burger.svg";
import { useEffect, useRef } from "react";
import checkImg from "./assets/Check.svg";
import playImg from "./assets/Play.svg";
import plusImg from "./assets/Plus.svg";
import playlistImg from "./assets/Playlist.svg";
import { appendSong } from "./utils";
import arrowImg from "./assets/Arrows.svg";

const Songs_List = ({ path, odd, observer, checked, setChecked, handlePlayNext, setPlay, playlists, openDialog, currentSong, draggable = false, dragStart = null, dragOver = null, dragEnd = null }) => {
    const ref = useRef(null);

    let updateThisCheck = () => {//Setts the check and adds to checked array
        if (checked.includes(path)) {
            setChecked(checked.filter((item) => item !== path));
        } else {
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
    }, [path]);


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
        appendSong(p_path, [path]).then(() => {
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
            <div id={`check-${path}`} className="song-el-check" onClick={() => { updateThisCheck() }}>
                <img src={checkImg} style={{ width: "inherit", visibility: checked.includes(path) ? "visible" : "hidden" }} />
            </div>
            <img id={`img-${path}`} className="song-el-album" src=""></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 25%", maxWidth: "25%", alignItems: "stretch" }}>
                <p id={`title-${path}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                <div className="dropdown">
                    <img src={plusImg} alt={burgerImg} className="song-el-add max-height" ></img>
                    <div id={`song-el-add-control-${path}`} className="song-el-add-control">
                        <div className="dropdown-control "  >
                            <div className="dropdown-playlist dropdown-el" onClick={handleNewPlaylist} >
                                <img src={plusImg} alt="" />
                                <p>Create New Playlist</p>
                            </div>
                            <div className="dropdown-playlist dropdown-el" onClick={() => { handlePlayNext(path) }}>
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
                </div>
            </div >
            <p id={`artist-${path}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`album-${path}`} className="song-el-album" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`duration-${path}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
        </div >
    );
}


export default Songs_List;