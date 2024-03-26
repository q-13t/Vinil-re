import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import utils from "./main";
import Songs_List from "./Songs-List";

// TODO: Implement playlist deletion
// TODO: Implement playlist renaming
// TODO: Implement song altering
// TODO: Implement playlist image and name displaying

const Playlist = ({ setPlaylists, selectedSongs, setSelectedSongs, observer }) => {
    const [queryParameters] = useSearchParams();
    let odd = false;
    let path = queryParameters.get("path");
    let [songs, setSongs] = useState([]);
    let [changed, setChanged] = useState(false);
    let [playlistName, setPlaylistName] = useState("Playlist Name");

    useEffect(() => {
        async function populate() {
            // Read playlist from path
            utils.getPlaylist(path).then((entries) => {
                setSongs(entries);
            });

        }
        populate();
    }, [path]);


    let textAreaChange = (e) => {
        setChanged(true);
        console.log(e.target.value);
        setPlaylistName(e.target.value);
    }

    let saveData = () => {
        console.log(playlistName);
        if (changed) {
            utils.renamePlaylist(path, playlistName).then(() => {
                utils.getPlaylists().then((playlists) => {
                    if (playlists.length > 0) {
                        setPlaylists(playlists);
                    }
                })
            });
        }
        setChanged(false);
    }

    return (
        <div id="Playlist">
            <div id="PlayListTopMenu">
                <div id="PlayListData">
                    <img src={burgerImg} alt="" />
                    <input type="text" onChange={(e) => textAreaChange(e)} value={playlistName} id="playlistName" />
                    <p id="PlayListDataSave" onClick={() => { saveData() }} style={{ display: changed ? "block" : "none" }}>Save</p>

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