import { useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useState } from "react";
import Songs_List from "./Songs-List";
import Songs_Grid from "./Songs-Grid";
import { searchAndSort, getFolders, appendSong } from "./utils";
import { invoke } from "@tauri-apps/api/tauri";
import shuffleImg from "./assets/Shuffle.svg";

const MainDisplay = ({ openDialog, playlists, selectedSongs, setSelectedSongs, setCurrentPlaylist, display, observer, history, setCurrentSong, currentSong, setForcePlay, forcePlay }) => {
    const [queryParameters] = useSearchParams();
    let [paths, setPaths] = useState([]);
    let [Loading, setLoading] = useState(false);
    let [as, setAs] = useState(queryParameters.get("as"));
    let odd = false;
    if (!display) { display = "My Music"; }
    if (!as) { as = "list"; }

    console.log(display, " : ", as);


    useEffect(() => {
        // console.log("Effect MD: ", display, display === "Current Play Queue");
        switch (display) {
            case "My Music": {
                // console.log("My Music");
                searchAndSort().then((res) => {
                    if (res !== undefined) {
                        setPaths(res);
                    } else {
                        getFolders().then((paths) => {
                            invoke("get_paths", { folders: paths, sortBy: "Time Created", searchText: "" }).then((paths) => {
                                setPaths(paths);
                            }).catch((err) => { });
                        })
                    }
                });
                break;
            }
            case "Recent Plays": {
                setPaths(history.slice().reverse());
                break;
            }
            case "Current Play Queue": {
                setPaths(localStorage.getItem("currentPlaylist") ? JSON.parse(localStorage.getItem("currentPlaylist")) : []);
                break;
            }
            case "Search Results": {
                console.log("Search Results");
                setLoading(true);
                let search = queryParameters.get("search-for");
                if (!search) {
                    search = "";
                } else {
                    search = search.toLowerCase();
                }
                let sortBy = document.getElementById("sort");
                if (!sortBy) sortBy = "Time Created"; else sortBy = sortBy.value;
                searchAndSort(sortBy, search).then((res) => {
                    setPaths(res);
                    setLoading(false);
                });

                break;
            }
        }
    }, [display]);

    useEffect(() => {// effect for checked songs
        let actions = document.getElementById("selectedActions");
        if (selectedSongs.length != 0) {
            actions.style.display = "flex";
            actions.classList.add("elem-fade-in-top");

        } else {
            actions.style.display = "none";
            actions.classList.remove("elem-fade-in-top");
        }
    }, [selectedSongs]);

    let fetchData = (event) => {
        document.getElementById("sort").disabled = true;
        setPaths([]);
        setLoading(true);
        let search = queryParameters.get("search-for");
        if (!search) {
            search = "";
        } else {
            search = search.toLowerCase();
        }
        searchAndSort(event.target.value, search).then((res) => {
            setPaths(res);
            document.getElementById("sort").disabled = false;
            setLoading(false);
        });
    }

    let saveToPlaylist = (event) => {
        console.log(event.target.value);
        appendSong(event.target.value, selectedSongs).then(() => {
            setSelectedSongs([]);
        });
    }

    let setToMinusOne = () => {
        document.getElementById("main-existing-playlists").selectedIndex = -1;
    }

    let playlistChange = (path) => {
        setForcePlay(!forcePlay)
        setCurrentPlaylist(paths);
        setCurrentSong(path);
        localStorage.setItem("currentPlaylist", JSON.stringify(paths));
    }

    let handleShuffle = () => {
        let shuffleControl = document.getElementById("controlShuffle");
        if (shuffleControl && !shuffleControl.classList.contains("activeBorder")) {
            shuffleControl.click();
        }
        setCurrentSong(paths[Math.floor(Math.random() * paths.length)]);
        localStorage.setItem("currentPlaylist", JSON.stringify(paths));
    }

    let handlePlayNext = (path) => {
        let currentPlaylist = JSON.parse(localStorage.getItem("currentPlaylist"));
        let currentIndexInPlaylist = currentPlaylist.indexOf(path);
        let index = currentPlaylist.indexOf(currentSong) + 1;
        let temp = [...currentPlaylist.slice(0, index), path, ...currentPlaylist.slice(index, currentIndexInPlaylist), ...currentPlaylist.slice(currentIndexInPlaylist + 1)];
        localStorage.setItem("currentPlaylist", JSON.stringify(temp));
    }


    return (
        <div id="MainDisplay">
            <div id="topNav">
                <h3>{display}</h3>
                <div id="topSubNav" className="elem-fade-in-top">
                    <p onClick={() => setAs("list")}>List</p>
                    <p onClick={() => setAs("grid")}>Grid</p>
                </div>
                <div id="displaySort" >
                    <div id="shuffleButton" onClick={handleShuffle}>
                        <img src={shuffleImg} alt={burgerImg}></img>
                        <p>Shuffle</p>
                    </div>
                    <select name="sort" id="sort" defaultValue={"Time Created"} onChange={(e) => { fetchData(e) }}>
                        <option value="Time Created">Time Created</option>
                        <option value="Title">Title</option>
                        <option value="Artist">Artist</option>
                    </select>
                </div>

                <div id="selectedActions" style={{ display: "none" }} >
                    <p onClick={() => { openDialog(true) }}>Save To New Playlist</p>
                    <div id="main-existing-playlists-container">
                        <label htmlFor="main-existing-playlists">Add To Existing</label>
                        <select id="main-existing-playlists" name="main-existing-playlists" onChange={(e) => { saveToPlaylist(e) }} onFocus={setToMinusOne}>
                            <option value="-1" style={{ display: "none" }}>--</option>
                            {playlists && playlists.map((playlist) => {
                                return <option key={playlist.path} value={playlist.path}>{playlist.name.replace(/\..*/mg, "")}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>

            <div id="MainSongContainer" {...(as === "grid" ? { className: "mainGrid" } : { className: "mainList" })}>
                {Loading ? <p>Loading...</p> : null}
                {paths && paths.length != 0 && as === "list" ?
                    paths.map((path) => {
                        odd = !odd; return <Songs_List key={path} path={path} odd={odd} handlePlayNext={handlePlayNext} openDialog={openDialog} currentSong={currentSong} setPlay={playlistChange} playlists={playlists} observer={observer} checked={selectedSongs} setChecked={setSelectedSongs} />;
                    }) : paths.map((path) => (<Songs_Grid key={path} path={path} observer={observer} handlePlayNext={handlePlayNext} openDialog={openDialog} playlists={playlists} setPlay={playlistChange} currentSong={currentSong} setChecked={setSelectedSongs} />))}
            </div>
        </div >
    );
};

export default MainDisplay;
