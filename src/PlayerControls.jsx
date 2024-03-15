import burgerImg from "./assets/Burger.png";

const PlayerControls = () => {
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
                    <img id="controlShuffle" src={burgerImg} alt="" />
                    <img id="controlPrevious" src={burgerImg} alt="" />
                    <img id="controlPlay" src={burgerImg} alt="" />
                    <img id="controlNext" src={burgerImg} alt="" />
                    <img id="controlRepeat" src={burgerImg} alt="" />
                </div>
                <div id="PlayerControlsTime">
                    <p id="timeCurrent"></p>
                    <input type="range" id="timeSlider" />
                    <p id="timeTotal"></p>
                </div>
            </div>
            <div id="PlayerControlsMisc">
                <img src={burgerImg} alt="" id="controlMute" />
                <input type="range" id="timeSlider" />
            </div>
        </div>
    );
}

export default PlayerControls;