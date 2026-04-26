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
                <div className="song-button ">
                    <img src={plusImg} alt={burgerImg} className="song-el-add dropdown" onMouseEnter={(e) => { checkBoundaries(e, path); }} ></img>
                </div>
            </div >
        </div >
    );
}

export default Songs_Grid;


