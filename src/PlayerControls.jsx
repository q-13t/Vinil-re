import { useEffect, useState } from "react";
import burgerImg from "./assets/Burger.svg";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { invoke } from "@tauri-apps/api";
import utils from "./main";
import repeatImg from "./assets/Repeat.svg";
import shuffleImg from "./assets/Shuffle.svg";
import previousImg from "./assets/Previous.svg";
import nextImg from "./assets/Next.svg";
import playImg from "./assets/Play.svg";
import pauseImg from "./assets/Pause.svg";
import soundImg from "./assets/Sound.svg";
import noSoundImg from "./assets/No Sound.svg";


const PlayerControls = ({ currentSong, setCurrentSong, currentPlaylist, history, setHistory }) => {

    let [player, setPlayer] = useState(new Audio());
    let shuffle = localStorage.getItem("shuffle") === "true";
    let load = false;
    useEffect(() => {
        async function fetchData() {
            const duration = document.getElementById(`timeTotal`);
            if (duration && player) {
                player.src = convertFileSrc(currentSong);
                player.onloadedmetadata = function () {// I wish not to do it this way, but can't make Rust read the duration :[
                    let minutes = Math.floor(player.duration / 60);
                    let seconds = Math.floor(player.duration - minutes * 60);
                    duration.innerHTML = minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
                    if (load) {
                        player.play();
                        load = true;
                    }
                };
            }
            const res = await invoke("get_tag", { path: currentSong });
            if (res) {
                const title = document.getElementById(`PlayerControlsSongDataTitle`);
                if (title) title.innerHTML = res[0];
                const artist = document.getElementById(`PlayerControlsSongDataArtist`);
                if (artist) artist.innerHTML = res[1];
                const img = document.getElementById(`PlayerControlsSongDataAlbum`);
                if (img) img.src = res[3] ? "data:image/webp;base64," + res[3] : burgerImg;
                const container = document.getElementById(`PlayerControlsContainer`);
                if (container) {
                    const rgb = utils.getAverageRGB(img);
                    container.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
                }
            }
            setHistory([...history, currentSong]);
            localStorage.setItem("currentSong", currentSong);
        };
        if (currentSong !== "" && currentSong !== null && currentSong !== undefined)
            fetchData();
    }, [currentSong])

    useEffect(() => {
        if (localStorage.getItem("loop") === "true") handleLoop();
        if (localStorage.getItem("shuffle") === "true") handleShuffle();
        if (localStorage.getItem("volume") !== null) {
            document.getElementById("volumeSlider").value = localStorage.getItem("volume")
            player.volume = localStorage.getItem("volume") / 100;
        };
        if (localStorage.getItem("muted") === "true") handleMute();
        if (localStorage.getItem("currentTime") !== null) {
            document.getElementById("timeSlider").value = localStorage.getItem("currentTime")
            player.currentTime = localStorage.getItem("currentTime")
        };
        if (player !== null) {
            player.onended = function () {
                if (shuffle) {
                    let index = Math.floor(Math.random() * currentPlaylist.length);
                    setCurrentSong(currentPlaylist[index]);
                } else document.getElementById("controlNext").click();
            }

            player.ontimeupdate = function () {
                let minutes = Math.floor(player.currentTime / 60);
                let seconds = Math.floor(player.currentTime - minutes * 60);
                let timeCurrent = document.getElementById(`timeCurrent`);
                if (timeCurrent) timeCurrent.innerHTML = minutes + ":" + (seconds > 9 ? seconds : "0" + seconds);
                let timeSlider = document.getElementById(`timeSlider`);
                if (timeSlider) timeSlider.value = Math.floor((player.currentTime / player.duration) * 100);
                if (!player.paused) document.getElementById("controlPlay").src = pauseImg;
                localStorage.setItem("currentTime", player.currentTime);
            }
        }

        return () => {
            player.src = null;
            setPlayer(null);
        }
    }, [])

    let toggleBorder = (event) => {
        event.target.classList.toggle("activeBorder");
    }

    let setTime = (event) => {
        player.currentTime = (player.duration * event.target.value) / 100;
    }

    let handlePrevious = () => {
        if (player.currentTime >= 10) {
            // player.pause();
            player.currentTime = 0;
            // player.play();
        } else {
            let index = history.indexOf(currentSong) - 1;
            if (index > 0) setCurrentSong(history[index]);
        }
    }

    let handleNext = () => {
        // console.log("next", shuffle);
        if (shuffle) {
            let index = Math.floor(Math.random() * currentPlaylist.length);
            setCurrentSong(currentPlaylist[index]);
        } else {
            // console.log(currentSong, currentPlaylist.includes(currentSong), currentPlaylist.indexOf(currentSong) + 1);
            let index = currentPlaylist.indexOf(currentSong) + 1;
            if (index === currentPlaylist.length) index = 0;
            setCurrentSong(currentPlaylist[index]);
        }
    }

    let handlePause = (event) => {
        if (player.paused) {
            player.play()
            event.target.src = pauseImg;
        } else {
            player.pause()
            event.target.src = playImg;
        }
    }

    let handleMute = (event) => {
        toggleBorder(event);
        player.muted = !player.muted, event.target.src = (player.muted ? noSoundImg : soundImg);
        localStorage.setItem("muted", player.muted);
    }

    let handleLoop = (event) => {
        toggleBorder(event);
        player.loop = !player.loop;
        localStorage.setItem("loop", player.loop);
        // console.log(shuffle, player.loop);

    }

    let handleShuffle = (event) => {
        toggleBorder(event);
        shuffle = !shuffle;
        localStorage.setItem("shuffle", shuffle);
        // console.log(shuffle, player.loop);
    }

    let handleVolume = (event) => {
        player.volume = event.target.value / 100;
        localStorage.setItem("volume", event.target.value);
    }

    return (
        <div id="PlayerControlsContainer">
            <div id="PlayerControlsSongData">
                <img id="PlayerControlsSongDataAlbum" src={burgerImg} alt="" />
                <div id="PlayerControlsSongConfiner">
                    <p id="PlayerControlsSongDataTitle">Title</p>
                    <p id="PlayerControlsSongDataArtist">Artist</p>
                </div>
            </div>
            <div id="PlayerControls">
                <div id="PlayerControlsButtons">
                    <img id="controlShuffle" className="inactiveBorder" src={shuffleImg} alt="" onClick={handleShuffle} />
                    <img id="controlPrevious" className="inactiveBorder" src={previousImg} alt="" onClick={handlePrevious} />
                    <img id="controlPlay" className="inactiveBorder" style={{ border: "1px solid var(--border-color)" }} src={playImg} alt="" onClick={handlePause} />
                    <img id="controlNext" className="inactiveBorder" src={nextImg} alt="" onClick={handleNext} />
                    <img id="controlRepeat" className="inactiveBorder" src={repeatImg} alt="" onClick={handleLoop} />
                </div>
                <div id="PlayerControlsTime">
                    <p id="timeCurrent">0:00</p>
                    <input type="range" id="timeSlider" onInput={setTime} defaultValue={0} />
                    <p id="timeTotal"></p>
                </div>
            </div>
            <div id="PlayerControlsMisc">
                <img src={soundImg} alt="" id="controlMute" onClick={handleMute} />
                <input type="range" id="volumeSlider" defaultValue={100} onInput={(e) => { handleVolume(e); }} />
            </div>
        </div>
    );
}

export default PlayerControls;