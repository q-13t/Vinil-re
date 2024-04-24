import { useEffect, useRef } from "react";
import { appendSong } from "./utils";

import burgerImg from "/Burger.svg";
import playImg from "/Play.svg";
import plusImg from "/Plus.svg";
import playlistImg from "/Playlist.svg";
import arrowImg from "/Arrows.svg";
import transparentImg from "/Transparent.svg";

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
        <div data-path={path} id={id} ref={ref} className="song-el-container-grid" >
            <img id={`img-${id}`} className="song-el-album" src={transparentImg} ></img>
            <p id={`title-${id}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <div className="song-el-grid-sub">
                <p id={`artist-${id}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <p id={`duration-${id}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            </div>

            <div className="song-el-buttons">
                <img src={playImg} alt={burgerImg} className="song-el-play" onClick={() => { setPlay(path) }}></img>
                <div className="dropdown">
                    <img src={plusImg} alt={burgerImg} className="song-el-add max-height" ></img>
                    <div id={`song-el-add-control-${id}`} className="song-el-add-control">
                        <div className="dropdown-control "  >
                            <div className=" dropdown-playlist dropdown-el" onClick={handleNewPlaylist}>
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
        </div >
    );
}

export default Songs_Grid;


