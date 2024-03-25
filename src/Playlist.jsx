import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import utils from "./main";
import Songs_List from "./Songs-List";

const Playlist = ({ selectedSongs, setSelectedSongs, observer }) => {
    const [queryParameters] = useSearchParams();
    let odd = false;
    let path = queryParameters.get("path");
    let [songs, setSongs] = useState([]);
    let [playlistName, setPlaylistName] = useState("Playlist Name");

    useEffect(() => {
        // Read playlist from path
        utils.getPlaylist(path).then((entries) => {
            setSongs(entries);
        });
    }, [path]);


    let textAreaChange = (e) => {
        let target = e.target;
        setPlaylistName(target.value);
    }



    return (
        <div id="Playlist">
            <div id="PlayListTopMenu">
                <div id="PlayListData">
                    <img src={burgerImg} alt="" />

                    <div contentEditable id="playlistName" onInput={(e) => { textAreaChange(e) }}  >{playlistName}</div>
                    <p id="PlayListDataSave">Save</p>

                </div>
                <div id="PlayListControls">
                    <p>Delete Playlist</p>
                    <p>Delete From Playlist</p>
                </div>
            </div>
            <div id="PlayListContent">
                {songs.length != 0 && songs.map((song) => {
                    odd = !odd; return <Songs_List key={song} path={song} odd={odd} observer={observer} checked={selectedSongs} setChecked={setSelectedSongs} />;
                })}
            </div>
        </div>
    );
}

export default Playlist;