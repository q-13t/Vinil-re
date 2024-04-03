import { useNavigate, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.svg";
import { useEffect, useState } from "react";
import Songs_List from "./Songs-List";
import Songs_Grid from "./Songs-Grid";
import utils from "./main";
import { invoke } from "@tauri-apps/api/tauri";
import { path } from "@tauri-apps/api";
import shuffleImg from "./assets/Shuffle.svg";

const MainDisplay = ({ openDialog, playlists, selectedSongs, setSelectedSongs, observer, history, currentPlaylist, setCurrentPlaylist, setCurrentSong, currentSong }) => {
    let navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    let [paths, setPaths] = useState([]);
    let [Loading, setLoading] = useState(false);
    let display = queryParameters.get("display");
    let as = queryParameters.get("as");
    let odd = false;
    if (!display) { display = "My Music"; }
    if (!as) { as = "list"; }

    console.log(display, " : ", as);

    let navigateTo = (url) => {// /?display=[]&as=[]
        navigate(url);
    }

    useEffect(() => {
        switch (display) {
            case "My Music": {
                console.log("My Music");
                utils.getFolders().then((folders) => {
                    // console.log(folders);
                    invoke("get_paths", { folders: folders, sortBy: "Time Created", searchText: "" }).then((res) => {
                        setPaths(res);
                    })
                });
                break;
            }
            case "Recent Plays": {
                console.log("Recent Plays");
                setPaths(history);
                break;
            }
            case "Current Play Queue": {
                console.log("Current Play Queue");
                setPaths(currentPlaylist);
                break;
            }
            case "Search Results": {
                console.log("Search Results");
                setPaths([]);
                setLoading(true);
                utils.getFolders().then((folders) => {
                    invoke("get_paths", { folders: folders, sortBy: "Time Created", searchText: queryParameters.get("search-for").toLowerCase() }).then((res) => {
                        setPaths(res);
                        setLoading(false);
                    })
                });
                break;
            }
        }
    }, [display]);


    useEffect(() => {// effect for checked songs
        if (selectedSongs.length != 0) {
            document.getElementById("selectedActions").style.display = "flex";

        } else {
            document.getElementById("selectedActions").style.display = "none";
        }
    }, [selectedSongs]);

    let fetchData = (event) => {
        document.getElementById("sort").disabled = true;
        setPaths([]);
        setLoading(true);
        utils.getFolders().then((folders) => {
            invoke("get_paths", { folders: folders, sortBy: event.target.value, searchText: queryParameters.get("search-for").toLowerCase() }).then((res) => {
                setPaths(res);
                document.getElementById("sort").disabled = false;
                setLoading(false);
            })
        });
    }

    let saveToPlaylist = (event) => {
        console.log(event.target.value);
        utils.appendSong(event.target.value, selectedSongs).then(() => {
            setSelectedSongs([]);
        });
    }

    let setToMinusOne = () => {
        document.getElementById("main-existing-playlists").selectedIndex = -1;
    }

    let playlistChange = (path) => {
        setCurrentPlaylist(paths);
        setCurrentSong(path);
        localStorage.setItem("currentPlaylist", JSON.stringify(paths));
    }

    let handleShuffle = () => {
        setCurrentPlaylist(paths);
        setCurrentSong(paths[Math.floor(Math.random() * paths.length)]);
        localStorage.setItem("currentPlaylist", JSON.stringify(paths));
    }

    return (
        <div id="MainDisplay">
            <div id="topNav">
                <h3>{display}</h3>
                <div id="topSubNav">
                    <p onClick={() => navigateTo("?display=My Music&as=list")}>List</p>
                    <p onClick={() => navigateTo("?display=My Music&as=grid")}>Grid</p>
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
                {paths.length != 0 && as === "list" ?
                    paths.map((path) => {
                        odd = !odd; return <Songs_List key={path} path={path} odd={odd} openDialog={openDialog} currentSong={currentSong} setPlay={playlistChange} playlists={playlists} observer={observer} checked={selectedSongs} setChecked={setSelectedSongs} />;
                    }) : paths.map((path) => (<Songs_Grid key={path} path={path} observer={observer} openDialog={openDialog} playlists={playlists} setPlay={playlistChange} currentSong={currentSong} setChecked={setSelectedSongs} />))}
            </div>
        </div >
    );
};

export default MainDisplay;
