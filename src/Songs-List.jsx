import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";

const Songs_List = ({ paths }) => {

    return (
        <div id="MainSongContainer">
            {paths.map((el) => (
                <div key={el} className="song-el-container-list"  >
                    <div className="song-el-check"></div>
                    <img src={burgerImg} alt={burgerImg} className="song-el-album"></img>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 20%" }}>
                        <p className="song-el-title">{el}</p>
                        <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                        <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
                    </div >
                    <p className="song-el-artist">Artist</p>
                    <p className="song-el-album">Album</p>
                    <p className="song-el-time">Time</p>
                </div>
            ))}
        </div>
    );
}


export default Songs_List;