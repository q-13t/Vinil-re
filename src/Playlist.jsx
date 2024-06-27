import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import burgerImg from "/Burger.svg";
import { getPlaylist, renamePlaylist, getPlaylists, getAverageRGB, savePlaylist, validatePlaylistName, displayPlaylistNameWarning, deletePlaylist, getTag } from "./utils";
import Songs_List from "./Songs-List";
import playlistImg from "/Playlist.svg";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Playlist = ({ setPlaylists, selectedSongs, setSelectedSongs, openDialog, observer, setCurrentPlaylist, setCurrentSong, currentSong, playlists, navigateTo, setForcePlay, forcePlay }) => {
    const [queryParameters] = useSearchParams();
    let path = queryParameters.get("path");
    let [paths, setPaths] = useState(null);
    let [changed, setChanged] = useState(false);
    let [playlistName, setPlaylistName] = useState("");

    console.log("playlist render");

    useEffect(() => {
        async function populate() {
            // Read playlist from path
            await getPlaylist(path).then(async (entries) => {//get songs
                setPaths(entries);
                let img = document.getElementById("PlayListImage");
                if (entries.length != 0) {
                    await getTag(entries[0], false).then((res) => {
                        if (img) if (res.image !== "") img.src = res.image; else img.src = playlistImg;
                    });
                } else {
                    img.src = playlistImg;
                }
                if (img) {
                    const rgb = getAverageRGB(img);
                    document.getElementById("PlayListTopMenu").style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
                }
            });
            setPlaylistName(queryParameters.get("name"));
        }
        populate();
    }, [path]);



    let textAreaChange = (e) => {
        setChanged(true);
        setPlaylistName(e.target.value);
    }

    let saveData = () => {
        if (validatePlaylistName(playlistName) == false) {
            displayPlaylistNameWarning();
            return;
        }
        if (changed) {
            renamePlaylist(path, playlistName).then(() => {
                getPlaylists().then((playlists) => {
                    if (playlists.length > 0) {
                        setPlaylists(playlists);
                    }
                })
            });
        }
        setChanged(false);
    }


    let handlePlay = (path) => {
        setForcePlay(!forcePlay);
        setCurrentPlaylist(paths);
        setCurrentSong(path);
        sessionStorage.setItem("currentIndex", paths.indexOf(path));
        localStorage.setItem("currentPlaylist", JSON.stringify(paths));
    }

    let handleDeletePlaylist = (path) => {
        deletePlaylist(path).then(() => {
            getPlaylists().then((playlists) => {
                if (playlists.length >= 0) {
                    setPlaylists(playlists);
                }
                document.getElementById("Delete-Playlist-Dialog").close();
            })
        });
    }
    let handleDeleteFromPlaylist = () => {
        let tmp = paths.filter((item) => !selectedSongs.includes(item));
        setPaths(tmp);
        savePlaylist(playlistName, tmp);
        setSelectedSongs([]);
    }

    let handlePlayNext = (path) => {
        let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist"));
        currentPlaylist.splice(parseInt(sessionStorage.getItem("currentIndex", currentPlaylist.indexOf(currentSong) + "")) + 1, 0, path);
        localStorage.setItem("currentPlaylist", JSON.stringify(currentPlaylist));
        setCurrentPlaylist(currentPlaylist);
    }

    function handleDragEnd(result) {
        if (!result.destination || result.destination.index === result.source.index) {
            return;
        }
        const songPaths = Array.from(paths);
        const reordered = songPaths.splice(result.source.index, 1);
        songPaths.splice(result.destination.index, 0, reordered[0]);
        setPaths(songPaths);
        async function commitChanges() {
            await getTag(songPaths[0], false).then((res) => {
                let img = document.getElementById("PlayListImage");
                if (res.image !== "")
                    img.src = res.image;
                else
                    img.src = playlistImg;
                const rgb = getAverageRGB(img);
                document.getElementById("PlayListTopMenu").style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            });

            savePlaylist(playlistName, songPaths);
        }
        commitChanges();
    }
    return (
        <div id="Playlist">
            <dialog id="Delete-Playlist-Dialog" style={{ display: "none" }}>
                <div id="Delete-Playlist-Dialog-Container">
                    <p>Are you sure you want to delete this playlist?</p>
                    <div>
                        <button onClick={() => { handleDeletePlaylist(path) }}>Delete</button>
                        <button onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "none" }}>Cancel</button>
                    </div>
                </div>
            </dialog>
            <div id="PlayListTopMenu">
                <div id="PlayListData" className="elem-fade-in-top">
                    <img id="PlayListImage" src={burgerImg} alt="" />
                    <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <input type="text" onChange={(e) => textAreaChange(e)} value={playlistName} id="playlistName" />
                            <p id="PlayListDataSave" onClick={() => { saveData() }} style={{ display: changed ? "block" : "none" }}>Save</p>
                        </div>
                        <div id="PlayListControls">
                            <p onClick={() => { document.getElementById("Delete-Playlist-Dialog").style.display = "flex" }}>Delete Playlist</p>
                            <p onClick={handleDeleteFromPlaylist}>Delete From Playlist</p>
                        </div>
                    </div>
                </div>

            </div>
            {/* Holy fuck! This shit ate my will to live more than the whole project */}
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="songs">
                    {(provided) => (
                        <div id="PlayListContent" ref={provided.innerRef} {...provided.droppableProps}  >
                            {paths && paths.length != 0 && paths.map((path, index) => (
                                <Draggable key={index} draggableId={index + ""} index={index}>
                                    {(provided, snapshot) => (
                                        <Songs_List providedRef={provided.innerRef} providedDraggableProps={provided.draggableProps} providedDragHandleProps={provided.dragHandleProps} id={index} path={path} handlePlayNext={handlePlayNext} odd={index % 2 == 0} observer={observer} setPlay={handlePlay} currentSong={currentSong} openDialog={openDialog} playlists={playlists} checked={selectedSongs} setChecked={setSelectedSongs} />
                                    )}
                                </Draggable>

                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div >
    );
}

export default Playlist;