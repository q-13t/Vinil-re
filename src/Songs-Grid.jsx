import { useEffect, useRef } from "react";


import burgerImg from "/Burger.svg";
import playImg from "/Play.svg";
import transparentImg from "/Transparent.svg";
import plusImg from "/Plus.svg";


const Songs_Grid = ({ path, id, observer, setPlay, currentSong, checkBoundaries }) => {
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
            <img id={`img-${id}`} className="song-el-album" src={transparentImg} ></img>
            <p id={`title-${id}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <div className="song-el-grid-sub">
                <p id={`artist-${id}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <p id={`duration-${id}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            </div>
            <div className="song-el-buttons">
                <img src={playImg} alt={burgerImg} className="song-button song-el-play" onClick={() => { setPlay(path) }}></img>
                <img src={plusImg} alt={burgerImg} className="song-button song-el-add dropdown" onMouseEnter={(e) => { checkBoundaries(e, path); }} ></img>
            </div >
        </div >
    );
}

export default Songs_Grid;


