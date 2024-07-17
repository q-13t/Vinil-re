import { useEffect, useState } from "react";
import burgerImg from "/Burger.svg";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { getTag, getAverageRGB } from "./utils";
import repeatImg from "/Repeat.svg";
import shuffleImg from "/Shuffle.svg";
import previousImg from "/Previous.svg";
import nextImg from "/Next.svg";
import playImg from "/Play.svg";
import pauseImg from "/Pause.svg";
import soundImg from "/Sound.svg";
import noSoundImg from "/No Sound.svg";
import vinilImg from "/Vinil.svg";
import AudioVisualizer from "./AudioVisualizer";

let historyIndex = 0;
let playlistIndex = 0;
let paused = true;
let load = false;
let shuffle = localStorage.getItem("shuffle") === "true";
let mediaMetadata = new window.MediaMetadata();


const PlayerControls = ({ currentSong, setCurrentSong, currentPlaylist, history, setHistory, forcePlay }) => {

    let [player, setPlayer] = useState(new Audio());

    useEffect(() => {
        async function fetchData() {
            const duration = document.getElementById(`timeTotal`);
            if (duration && player) {
                try {
                    player.src = convertFileSrc(currentSong);
                } catch (error) {
                    console.error(`[fetchData] error: ${error}`);
                    handleNext();
                }
                getTag(currentSong, false).then((res) => {
                    const title = document.getElementById(`PlayerControlsSongDataTitle`);
                    const artist = document.getElementById(`PlayerControlsSongDataArtist`);
                    const img = document.getElementById(`PlayerControlsSongDataAlbum`);
                    const progress = document.getElementById(`timeSlider`);

                    if (load && !paused) { player.play(); }
                    if (!load) { addToHistory(currentSong) };
                    if (progress) { progress.value = 0; };
                    if (duration) { duration.innerHTML = res.duration };
                    if (!load) { load = true };
                    if (title) { title.innerHTML = res.title };
                    if (artist) { artist.innerHTML = res.artist };
                    if (img) {
                        if (res.image !== "") { img.src = res.image; }
                        else { img.src = vinilImg; }
                    }
                    mediaMetadata.title = res.title;
                    mediaMetadata.artist = res.artist;
                    mediaMetadata.album = res.album;
                    mediaMetadata.artwork = [{ src: res.image, type: 'image/webp' },]
                });
                localStorage.setItem("currentSong", currentSong);
            }
        };
        if (currentSong !== "" && currentSong !== null && currentSong !== undefined) {
            fetchData();
        }
    }, [currentSong]);

    useEffect(() => {
        if (!load) { return; }

        player.play();
        paused = false;
        player.currentTime = 0;
        playlistIndex = parseInt(sessionStorage.getItem("currentIndex"));
        if (currentSong === currentPlaylist[playlistIndex]) {
            addToHistory(currentSong);
        }

    }, [forcePlay]);

    useEffect(() => {
        if (player === null) { setPlayer(new Audio()) }
        if (localStorage.getItem("loop") === "true") {
            player.loop = true;
            document.getElementById("controlRepeat").classList.toggle("activeBorder");
        };
        if (shuffle) {
            document.getElementById("controlShuffle").classList.toggle("activeBorder");
        };

        if (localStorage.getItem("volume") !== null && document.getElementById("volumeSlider")) {
            document.getElementById("volumeSlider").value = localStorage.getItem("volume")
            player.volume = localStorage.getItem("volume") / 100;
        };
        if (localStorage.getItem("muted") === "true") {
            document.getElementById("controlMute").click();
        };
        if (localStorage.getItem("currentTime") !== null) {
            document.getElementById("timeSlider").value = localStorage.getItem("currentTime")
            player.currentTime = localStorage.getItem("currentTime")
        };

        player.crossOrigin = "anonymous";
        player.onended = function () {
            handleNext();
            if (load && (!paused || currentPlaylist.length == 1)) { player.play(); } // WTF: I hate this
        };

        player.onloadedmetadata = function () {
            document.getElementById("timeSlider").setAttribute("max", Math.floor(player.duration));
        }


        //Timeline & time count updater
        const timeCurrent = document.getElementById(`timeCurrent`);
        const timeSlider = document.getElementById(`timeSlider`);
        player.ontimeupdate = () => {
            const minutes = Math.floor(player.currentTime / 60);
            const seconds = Math.floor(player.currentTime % 60);
            const timeCurrentFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            if (timeCurrent) {
                timeCurrent.textContent = timeCurrentFormatted;
            }
            if (timeSlider) {
                timeSlider.value = Math.floor(player.currentTime);
            }
            if (!player.paused) {
                document.getElementById("controlPlay").src = pauseImg;
            }
            localStorage.setItem("currentTime", Math.floor(player.currentTime));
        };

        if (!load) {
            // Media Session metadata
            navigator.mediaSession.metadata = mediaMetadata;
            // Media Session controls
            navigator.mediaSession.setActionHandler('play', () => { document.getElementById("controlPlay").click(); });
            navigator.mediaSession.setActionHandler('pause', () => { document.getElementById("controlPlay").click(); });
            navigator.mediaSession.setActionHandler('seekbackward', () => { document.getElementById("controlPrevious").click(); });
            navigator.mediaSession.setActionHandler('seekforward', () => { document.getElementById("controlNext").click(); });
            navigator.mediaSession.setActionHandler('previoustrack', () => { document.getElementById("controlPrevious").click(); });
            navigator.mediaSession.setActionHandler('nexttrack', () => { document.getElementById("controlNext").click(); });
        }

    }, []);

    let addToHistory = (path) => {
        history.unshift(path);
        setHistory(history);
        historyIndex = 0;
    }

    let imgLoad = (event) => {
        const container = document.getElementById(`PlayerControlsContainer`);
        if (container) {
            const rgb = getAverageRGB(event.target);
            if (document.documentElement.classList.contains("light")) {
                container.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
            } else {
                container.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.55)`;
            }
            document.body.style.cssText = `--accent-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`;
        }
    }
    let toggleBorder = (event) => {
        if (event && event.target) event.target.classList.toggle("activeBorder");
    }

    let setTime = (event) => {
        player.currentTime = event.target.value;
        // (player.duration * event.target.value) / 100;
    }

    let handlePrevious = () => {
        if (player.currentTime <= 10 && historyIndex >= 0) {
            historyIndex = historyIndex + 1 >= history.length ? -1 : historyIndex;
            setCurrentSong(history[++historyIndex]);
        }
        player.currentTime = 0;
    }

    let handleNext = () => {
        let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist"));
        if (historyIndex > 0) {// if user is in history
            setCurrentSong(history[--historyIndex]);
        } else if (shuffle) {// if shuffle is on
            let rand = Math.floor(Math.random() * currentPlaylist.length);
            playlistIndex = rand;
            sessionStorage.setItem("currentIndex", playlistIndex);
            addToHistory(currentPlaylist[rand])
            setCurrentSong(currentPlaylist[rand]);
        } else {// If it is simply play next
            //Increment playlist index by 1 or reset to 0
            playlistIndex = playlistIndex < currentPlaylist.length - 1 ? playlistIndex += 1 : 0;
            addToHistory(currentPlaylist[playlistIndex])
            setCurrentSong(currentPlaylist[playlistIndex]);
            sessionStorage.setItem("currentIndex", playlistIndex);
        }
    }


    let handlePause = (event) => {
        console.log("[HandlePause] player.paused:", player.paused);
        if (player.paused) {
            player.play();
            paused = false;
            event.target.src = pauseImg;
        } else {
            player.pause();
            paused = true;
            event.target.src = playImg;
        }
    }

    let handleMute = (event) => {
        toggleBorder(event);
        player.muted = !player.muted;
        if (event && event.target) event.target.src = (player.muted ? noSoundImg : soundImg);
        localStorage.setItem("muted", player.muted);
    }

    let handleLoop = (event) => {
        toggleBorder(event);
        player.loop = !player.loop;
        localStorage.setItem("loop", player.loop);
    }

    let handleShuffle = (event) => {
        toggleBorder(event);
        shuffle = !shuffle;
        localStorage.setItem("shuffle", shuffle);
    }

    let handleVolume = (event) => {
        if (event && event.target) {
            player.volume = event.target.value / 100;
            localStorage.setItem("volume", event.target.value);
        }
    }


    return (
        <div id="PlayerControlsContainer">
            <AudioVisualizer player={player} />
            <div id="PlayerControlsSongData">
                <img id="PlayerControlsSongDataAlbum" draggable="false" src={vinilImg} alt={burgerImg} onLoad={imgLoad} />
                <div id="PlayerControlsSongConfiner">
                    <p id="PlayerControlsSongDataTitle">Title</p>
                    <p id="PlayerControlsSongDataArtist">Artist</p>
                </div>
            </div>
            <div id="PlayerControls">
                <div id="PlayerControlsButtons">
                    <div className="control-button">
                        <img id="controlShuffle" draggable="false" className="inactiveBorder" src={shuffleImg} alt="" onClick={handleShuffle} />
                    </div>
                    <div className="control-button">
                        <img id="controlPrevious" draggable="false" className="inactiveBorder" src={previousImg} alt="" onClick={handlePrevious} />
                    </div>
                    <div className="control-button">
                        <img id="controlPlay" draggable="false" className="inactiveBorder" style={{ border: "1px solid var(--border-color)" }} src={playImg} alt="" onClick={handlePause} />
                    </div>
                    <div className="control-button">
                        <img id="controlNext" draggable="false" className="inactiveBorder" src={nextImg} alt="" onClick={handleNext} />
                    </div>
                    <div className="control-button">
                        <img id="controlRepeat" draggable="false" className="inactiveBorder" src={repeatImg} alt="" onClick={handleLoop} />
                    </div>
                </div>
                <div id="PlayerControlsTime">
                    <p id="timeCurrent">0:00</p>
                    <input type="range" id="timeSlider" onInput={setTime} defaultValue={0} />
                    <p id="timeTotal"></p>
                </div>
            </div>
            <div id="PlayerControlsMisc">
                <div className="control-button">
                    <img src={soundImg} alt="" draggable="false" id="controlMute" onClick={handleMute} />
                </div>
                <input type="range" id="volumeSlider" defaultValue={100} onInput={(e) => { handleVolume(e); }} />
            </div>
        </div>
    );
}

export default PlayerControls;