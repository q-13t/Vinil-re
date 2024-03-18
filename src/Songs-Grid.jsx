import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";

const Songs_Grid = ({ paths }) => {
    return (


        paths.map((el) => (
            <div key={el} className="song-el-container-grid"  >
                <img src={burgerImg} alt={burgerImg} className="song-el-album"></img>

                <p className="song-el-title">{el}</p>
                <div style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
                    <p className="song-el-artist">Artist</p>
                    <p className="song-el-time">Time</p>
                </div>

                <div className="song-el-buttons">
                    <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                    <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
                </div >
            </div >
        ))

    );
}

export default Songs_Grid;