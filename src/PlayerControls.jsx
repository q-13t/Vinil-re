import { useEffect, useState } from "react";
import burgerImg from "./assets/Burger.svg";
import { convertFileSrc } from "@tauri-apps/api/tauri";

import { getTag, getAverageRGB } from "./utils";
import repeatImg from "./assets/Repeat.svg";
import shuffleImg from "./assets/Shuffle.svg";
import previousImg from "./assets/Previous.svg";
import nextImg from "./assets/Next.svg";
import playImg from "./assets/Play.svg";
import pauseImg from "./assets/Pause.svg";
import soundImg from "./assets/Sound.svg";
import noSoundImg from "./assets/No Sound.svg";
import vinilImg from "/Vinil.svg";

let historyIndex = 0;
let addToHistory = true;
let paused = true;
let shuffle = localStorage.getItem("shuffle") === "true";

const PlayerControls = ({ currentSong, setCurrentSong, currentPlaylist, history, setHistory, forcePlay }) => {

    let [player, setPlayer] = useState(new Audio());
    let [load, setLoad] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const duration = document.getElementById(`timeTotal`);
            if (duration && player) {
                player.src = convertFileSrc(currentSong);

                getTag(currentSong, false).then((res) => {
                    const title = document.getElementById(`PlayerControlsSongDataTitle`);
                    const artist = document.getElementById(`PlayerControlsSongDataArtist`);
                    const img = document.getElementById(`PlayerControlsSongDataAlbum`);
                    const progress = document.getElementById(`timeSlider`);


                    console.log(load, !paused);
                    if (load && !paused) { player.play(); }


                    if (addToHistory) historyIndex = history.length;
                    if (progress) progress.value = 0;
                    if (duration) duration.innerHTML = res.duration;
                    if (!load) setLoad(true);
                    if (title) title.innerHTML = res.title;
                    if (artist) artist.innerHTML = res.artist;
                    if (img) {
                        if (res.image !== "")
                            img.src = res.image;
                        else
                            img.src = vinilImg;
                    }
                    navigator.mediaSession.metadata = new MediaMetadata({
                        title: res.title,
                        artist: res.artist,
                        album: res.album,
                        artwork: [
                            { src: res.image, type: 'image/webp' },
                        ]
                    });
                })
                if (addToHistory) {
                    setHistory([...history.filter((song) => song !== currentSong), currentSong]);
                }
                localStorage.setItem("currentSong", currentSong);
            }
        };
        if (currentSong !== "" && currentSong !== null && currentSong !== undefined) {
            fetchData();
        }

    }, [currentSong]);

    useEffect(() => {
        if (load) player.play();
        paused = false;
    }, [forcePlay])

    useEffect(() => {
        console.log("player", player);
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
        if (localStorage.getItem("muted")) handleMute();
        if (localStorage.getItem("currentTime") !== null) {
            document.getElementById("timeSlider").value = localStorage.getItem("currentTime")
            player.currentTime = localStorage.getItem("currentTime")
        };

        player.crossOrigin = "anonymous";
        player.onended = function () {
            document.getElementById("controlNext").click();
        }

        //  Audio Visualizer

        const canvas = document.getElementById('PlayerControlsCanvas');
        const audioContext = new AudioContext();
        audioContext.resume();
        const context = canvas.getContext('2d');
        let audioSource;
        let analyzer;
        if (!audioSource) audioSource = audioContext.createMediaElementSource(player);
        analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 1024;
        const bufferLength = analyzer.frequencyBinCount; // fftSize / 2
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = ((canvas.width / 1.65) / (bufferLength));

        let barHeight;
        let barPosition;


        const draw = async () => { // audio visualization draw loop
            barPosition = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            analyzer.getByteFrequencyData(dataArray);
            let color = getComputedStyle(document.body).getPropertyValue("--accent-color");
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                context.fillStyle = color;
                context.fillRect(barPosition, canvas.height - barHeight, barWidth, barHeight);
                context.fillRect(canvas.width - barPosition, canvas.height - barHeight, barWidth, barHeight);
                barPosition += barWidth;
            }

            requestAnimationFrame(draw);
        }
        draw();

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


        navigator.mediaSession.setActionHandler('play', () => {
            if (!player.paused) {
                player.pause(); document.getElementById("controlPlay").src = playImg;
            } else { player.play(); document.getElementById("controlPlay").src = pauseImg; }
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            if (!player.paused) {
                player.pause(); document.getElementById("controlPlay").src = playImg;
            } else { player.play(); document.getElementById("controlPlay").src = pauseImg; }
        });
        navigator.mediaSession.setActionHandler('seekbackward', () => { document.getElementById("controlPrevious").click(); });
        navigator.mediaSession.setActionHandler('seekforward', () => { document.getElementById("controlNext").click(); });
        navigator.mediaSession.setActionHandler('previoustrack', () => { document.getElementById("controlPrevious").click(); });
        navigator.mediaSession.setActionHandler('nexttrack', () => { document.getElementById("controlNext").click(); });


        return () => {
        }
    }, [])

    let imgLoad = (event) => {
        const container = document.getElementById(`PlayerControlsContainer`);
        if (container) {
            const rgb = getAverageRGB(event.target);
            container.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
            document.body.style.cssText = `--accent-color: rgb(${rgb.r}, ${rgb.g}, ${rgb.b});`;
        }
    }
    let toggleBorder = (event) => {
        event.target.classList.toggle("activeBorder");
    }

    let setTime = (event) => {
        player.currentTime = (player.duration * event.target.value) / 100;
    }

    let handlePrevious = () => {
        if (player.currentTime >= 10) {
            player.currentTime = 0;
        } else if (historyIndex > 0) {
            addToHistory = false;
            historyIndex = historyIndex - 1;
            setCurrentSong(history[historyIndex]);
        }
    }

    let handleNext = () => {
        let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist"));
        if (historyIndex < history.length - 1) {
            addToHistory = false;
            historyIndex = historyIndex + 1
            setCurrentSong(history[historyIndex]);
        } else if (shuffle) {
            historyIndex = Math.floor(Math.random() * currentPlaylist.length);
            addToHistory = true;
            setCurrentSong(currentPlaylist[historyIndex]);
        } else {
            let currentIndexInPlaylist = currentPlaylist.indexOf(currentSong);
            if (currentIndexInPlaylist < currentPlaylist.length - 1) {
                addToHistory = true;
                setCurrentSong(currentPlaylist[currentIndexInPlaylist + 1]);
            } else {
                addToHistory = true;
                currentIndexInPlaylist = 0;
                setCurrentSong(currentPlaylist[currentIndexInPlaylist]);
            }
        }
    }


    let handlePause = (event) => {
        console.log("HandlePause", player.paused);
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
        player.muted = !player.muted, event.target.src = (player.muted ? noSoundImg : soundImg);
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
        player.volume = event.target.value / 100;
        localStorage.setItem("volume", event.target.value);
    }



    return (
        <div id="PlayerControlsContainer">
            <canvas id="PlayerControlsCanvas"  ></canvas>
            <div id="PlayerControlsSongData">
                <img id="PlayerControlsSongDataAlbum" src={vinilImg} alt={burgerImg} onLoad={imgLoad} />
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