import { useEffect, useState } from "react";
import { getPlaylists, savePlaylist, validatePlaylistName } from "./utils";

const NewPlayListDialog = ({ open, openDialog, selectedSongs, setSelectedSongs, setPlaylists }) => {

    let [playlistName, setPlaylistName] = useState("");

    let save = (e) => {
        e.preventDefault();
        if (validatePlaylistName(playlistName) == false) {
            displayPlaylistNameWarning();
            return
        }
        savePlaylist(playlistName, selectedSongs).then(() => {
            getPlaylists().then((playlists) => {
                if (playlists.length > 0) {
                    setPlaylists(playlists);
                }
            })

            setSelectedSongs([]);
        });
        setPlaylistName("");
        openDialog(false);
    }

    let close = (e) => {
        e.preventDefault();
        setPlaylistName("");
        openDialog(false);
    }

    useEffect(() => {
        if (open) {
            document.getElementById("new-playlist-dialog").style.display = "flex";
        }
        else {
            document.getElementById("new-playlist-dialog").style.display = "none";
            setPlaylistName("");
        }
    }, [open])

    return (
        <dialog id="new-playlist-dialog"  >
            <div id="dialog-container">
                <input type="text" placeholder="Enter Playlist name" onChange={(e) => setPlaylistName(e.target.value)} />
                <div>
                    <button onClick={close}>Cancel</button>
                    <button onClick={save}>Save</button>
                </div>
            </div>
        </dialog>
    );
}

export default NewPlayListDialog;