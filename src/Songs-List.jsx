import { useEffect, useRef } from "react";

import burgerImg from "/Burger.svg";
import checkImg from "/Check.svg";
import playImg from "/Play.svg";
import transparentImg from "/Transparent.svg";
import plusImg from "/Plus.svg";


const Songs_List = ({ providedRef = null, providedDraggableProps = {}, providedDragHandleProps = {}, id, path, odd, observer, checked, setChecked, setPlay, currentSong, checkBoundaries }) => {
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



    return (
        <div data-path={path} id={id} ref={providedRef !== null ? providedRef : ref} {...providedDraggableProps} {...providedDragHandleProps} className={`song-el-container-list ${odd ? "odd" : ""}`}>
            <div id={`check-${id}`} className="song-el-check" onClick={() => { updateThisCheck() }}>
                <img src={checkImg} style={{ width: "inherit", visibility: checked.includes(path) ? "visible" : "hidden" }} />
            </div>
            <img id={`img-${id}`} className="song-el-album" src={transparentImg} ></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 25%", maxWidth: "25%", alignItems: "center" }}>
                <p id={`title-${id}`} className="song-el-title" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
                <img src={playImg} alt={burgerImg} className="song-button max-height song-el-play" onClick={() => { setPlay(path) }}></img>
                <img src={plusImg} alt={burgerImg} className="song-button song-el-add max-height" onMouseEnter={(e) => { checkBoundaries(e, path); }} ></img>
            </div >
            <p id={`artist-${id}`} className="song-el-artist" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`album-${id}`} className="song-el-album" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
            <p id={`duration-${id}`} className="song-el-time" style={{ color: currentSong === path ? "var(--accent-color)" : "" }}></p>
        </div >
    );
}


export default Songs_List;