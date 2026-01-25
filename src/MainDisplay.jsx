import { useSearchParams } from "react-router-dom";
import burgerImg from "/Burger.svg";
import { useEffect, useState } from "react";
import Songs_List from "./Songs-List";
import Songs_Grid from "./Songs-Grid";
import { searchAndSort, getFolders, appendSong } from "./utils";
import { invoke } from "@tauri-apps/api/tauri";
import shuffleImg from "/Shuffle.svg";
import DropDownMenu from "./DropDownMenu";

let preserved_as = "list";

const MainDisplay = ({ openDialog, playlists, selectedSongs, setSelectedSongs, setCurrentPlaylist, display, observer, history, setCurrentSong, currentSong, setForcePlay, forcePlay }) => {
    const [queryParameters] = useSearchParams();
    let [paths, setPaths] = useState([]);
    let [Loading, setLoading] = useState(false);
    let [as, setAs] = useState(queryParameters.get("as"));
    let [hovered_song, setHoveredSong] = useState(null);
    let [as, setAs] = useState(preserved_as);
    if (!display) { display = "My Music"; }
    if (!as) { as = "list"; }




    // console.log(display, " : ", as);



    useEffect(() => {
        // console.log("Effect MD [display, search]: ", display, queryParameters.get("search-for"));
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
                setPaths(history);
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
                console.log(search);
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
    }, [display, queryParameters.get("search-for")]);

    useEffect(() => {
        if (display === "Current Play Queue") {
            setPaths(localStorage.getItem("currentPlaylist") ? JSON.parse(localStorage.getItem("currentPlaylist")) : []);
        } else if (display === "Recent Plays") {
            setPaths(history);
        }
    }, [localStorage.getItem("currentPlaylist"), history]);

    useEffect(() => {// effect for checked songs
        // console.log("Effect MD [selected] ");
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

    let handlePlay = (path) => {
        // console.log(paths);
        setForcePlay(!forcePlay)
        setCurrentPlaylist(paths);
        setCurrentSong(path);
        sessionStorage.setItem("currentIndex", paths.indexOf(path));
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
        currentPlaylist.splice(parseInt(sessionStorage.getItem("currentIndex", currentPlaylist.indexOf(currentSong) + "")) + 1, 0, path);
        localStorage.setItem("currentPlaylist", JSON.stringify(currentPlaylist));
        setCurrentPlaylist(currentPlaylist);
    }

    let handleUpdateContainer = () => {
        if (display === "My Music") {
            searchAndSort().then((res) => {
                if (res != undefined) {
                    setPaths(res);
                } else {
                    getFolders().then((paths) => {
                        invoke("get_paths", { folders: paths, sortBy: "Time Created", searchText: "" }).then((paths) => {
                            setPaths(paths);
                        }).catch((err) => { });
                    })
                }
            });
        }
    }


    /**
     * 
     * @param {HTMLEvent} e hover event
     * @param {String} s_path path of the song that has been hovered
     * @returns none
     */
    let checkBoundaries = (e, s_path) => {
        let target_rect = e.target.getBoundingClientRect();
        let drop = document.getElementById(`song-el-add-control`);
        if (!drop) {
            return;
        } else if (s_path && e) {
            let top = target_rect.top;
            let left = target_rect.left + (target_rect.width / 2) - (drop.getBoundingClientRect().width / 2);
            if (top + drop.getBoundingClientRect().height > window.innerHeight) {
                top = window.innerHeight - drop.getBoundingClientRect().height - 10;
            }

            drop.style = `top: ${top}px; left: ${left}px`;

            setHoveredSong(s_path);
            drop.classList.add('song-el-add-control-hover');
        } else {
            setHoveredSong(null);
            drop.classList.remove('song-el-add-control-hover');
        }
    }


    return (
        <div id="MainDisplay">
            <div id="topNav">
                <h3>{display}</h3>
                <div id="topSubNav" className="elem-fade-in-top">
                    <p onClick={() => { setAs("list"); preserved_as = "list" }}>List</p>
                    <p onClick={() => { setAs("grid"); preserved_as = "grid" }}>Grid</p>
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
            <span style={{ display: "none" }} id="songContainerUpdater" onClick={() => { handleUpdateContainer(); }}></span> {/* Hidden span that is used to trigger the update on click from another component */}
            <div id="MainSongContainer" {...(as === "grid" ? { className: "mainGrid" } : { className: "mainList" })}>
                <DropDownMenu hovered_song={hovered_song} playlists={playlists} openDialog={openDialog} setChecked={setSelectedSongs} handlePlayNext={handlePlayNext} checkBoundaries={checkBoundaries} />
                {Loading && Loading === true ? <p>Loading...</p> : null}
                {paths && paths.length != 0 && as === "list" ?
                    paths.map((path, index) => {
                        return <Songs_List id={index} key={index} path={path} odd={index % 2 == 0} handlePlayNext={handlePlayNext} openDialog={openDialog} currentSong={currentSong} setPlay={handlePlay} playlists={playlists} observer={observer} checked={selectedSongs} setChecked={setSelectedSongs} checkBoundaries={checkBoundaries} setHoveredSong={setHoveredSong} />;
                    }) : paths.map((path, index) => {
                        return <Songs_Grid id={index} key={index} path={path} observer={observer} handlePlayNext={handlePlayNext} openDialog={openDialog} playlists={playlists} setPlay={handlePlay} currentSong={currentSong} setChecked={setSelectedSongs} checkBoundaries={checkBoundaries} setHoveredSong={setHoveredSong} />
                    })}
            </div>
        </div >
    );
};

export default MainDisplay;
