import burgerImg from "/Burger.svg";
import PlaylistPreview from "./PlaylistPreview";
import gearImg from "/Gear.svg";
import plusImg from "/Plus.svg";
import clockImg from "/Clock.svg";
import arrowsImg from "/Arrows.svg";
import XImg from "/X.svg";
import searchImg from "/Search.svg";
import { useEffect, useState } from "react";
import barsImg from "/Bars.svg";
import { getFolders } from "./utils";

const SideMenu = ({ openDialog, playlists, navigateTo, setDisplay }) => {
    let [search, setSearch] = useState("");
    let [maximized, setMaximized] = useState(true);
    let [lastNav, setLastNav] = useState();

    useEffect(() => {
        // console.log(lastNav);
        // console.log(playlists);
        if (lastNav && document.getElementById(lastNav.id)) {
            let el = document.getElementById(lastNav.id);
            if (el && !el.classList.contains("activeBorder-right")) {
                el.classList.add("activeBorder-right");
                setLastNav(el);
            }
        } else {
            getFolders().then((folders) => {
                if (folders.length > 0) {
                    document.getElementById("My Music").click();
                } else {
                    document.getElementById("Settings-button").click();
                }
            })
        }
    }, [maximized, playlists]);

    /**
     * Redirects page to path
     * @example
     * handleNavigate(e, "/?display=Recent Plays&as=list")}
     * @param {Event} event event
     * @param {String} path Path to navigate to
     */
    let handleNavigate = (event, path) => {
        if (lastNav) lastNav.classList.toggle("activeBorder-right");//turn off border highlight
        setLastNav(event.target);
        event.target.classList.toggle("activeBorder-right");//turn on border highlight
        navigateTo(path);
    }

    let handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            document.getElementById("search-Search").click();
        }
    }
    let handleChange = (event) => {
        setSearch(event.target.value);
    }

    return (
        <>

            {maximized
                ?
                <div id="SideMenu">
                    <progress style={{ width: "100%", }} id="indexing-progress" type="range" min="0" max="100" />
                    < div >
                        <div className="burger-container sideMenuBurger" onClick={() => { setMaximized(false); }}>
                            <img src={burgerImg} draggable="false" alt="" />
                        </div>

                        <div id="SearchBar">
                            <input id="search-Input" type="text" placeholder="Search" value={search} onKeyDown={(e) => { handleKeyDown(e); }} onChange={(e) => { handleChange(e); }} />
                            <img id="search-Search" style={{ display: search === "" ? "none" : "block" }} src={searchImg} alt={burgerImg} onClick={(e) => { setDisplay("Search Results"); navigateTo(`/?as=list&search-for=${search}`) }}></img>
                            <img id="search-Clear" style={{ display: search === "" ? "none" : "block" }} src={XImg} alt={burgerImg} onClick={() => { setSearch(""); navigateTo(`/`) }} ></img>
                        </div>
                    </div >
                    <div id="MainScrollable" >

                        <div id="My Music" title="My Music" className="sideMenuButton" onClick={(e) => { setDisplay("My Music"); handleNavigate(e, "/") }}>
                            <img src={barsImg} alt={burgerImg} aria-hidden="true" tabIndex={-1} className="small-img"></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>My Music</p>
                        </div>
                        <div id="RecentList" title="Recent Plays" className="sideMenuButton" onClick={(e) => { setDisplay("Recent Plays"); handleNavigate(e, "/") }}>
                            <img src={clockImg} alt={burgerImg} aria-hidden="true" tabIndex={-1} className="small-img"></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Recent plays</p>
                        </div>
                        <div id="CurrentList" title="Current Play Queue" className="sideMenuButton" onClick={(e) => { setDisplay("Current Play Queue"); handleNavigate(e, "/") }}>
                            <img src={arrowsImg} alt={burgerImg} aria-hidden="true" tabIndex={-1} className="small-img"></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Now playing</p>
                        </div>
                        <div id="PlaylistsContainer">
                            <div id="Playlists">
                                <div id="PlaylistsButton"  >
                                    <img src={burgerImg} alt="" aria-hidden="true" tabIndex={-1} className="small-img"></img>
                                    <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Playlists</p>
                                </div>
                                <div className="AddPlaylistButton" onClick={openDialog}>
                                    <   img src={plusImg} alt="" className="small-img"></img>
                                </div>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} />))}
                            </div>
                        </div>
                    </div>

                    <div id="Settings-button" className="sideMenuButton" onClick={(e) => { handleNavigate(e, "/settings"); }}>
                        <img src={gearImg} alt="" aria-hidden="true" tabIndex={-1} className="small-img"></img>
                        <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Settings</p>
                    </div>
                </div >
                :
                <div id="SideMenu-small">
                    <progress style={{ width: "100%", }} id="indexing-progress" type="range" min="0" max="100" />
                    <span className="burger-container sideMenuBurger" onClick={() => { setMaximized(true); }}>
                        <img id="" draggable="false" src={burgerImg} alt="" />
                    </span>
                    <div id="MainScrollable">
                        <div id="My Music" title="My Music" className="sideMenuButton " onClick={(e) => { setDisplay("My Music"); handleNavigate(e, "/") }} >
                            <img className="small-img" src={barsImg} alt={burgerImg} ></img>
                        </div>
                        <div id="RecentList" title="Recent Plays" className="sideMenuButton " onClick={(e) => { setDisplay("Recent Plays"); handleNavigate(e, "/") }}>
                            <img className="small-img" src={clockImg} alt={burgerImg} ></img>
                        </div>
                        <div id="CurrentList" title="Current Play Queue" className="sideMenuButton " onClick={(e) => { setDisplay("Current Play Queue"); handleNavigate(e, "/") }} >
                            <img className="small-img" src={arrowsImg} alt={burgerImg} ></img>
                        </div>
                        <div id="PlaylistsContainer">
                            <div id="Playlists" style={{ justifyContent: "center" }}>
                                <div className="AddPlaylistButton" onClick={openDialog}>
                                    <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog}></img>
                                </div>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} small={true} />))}
                            </div>
                        </div>
                    </div>
                    <img id="Settings-button" src={gearImg} alt={burgerImg} className="sideMenuButton small-img" onClick={(e) => { handleNavigate(e, "/settings"); }} ></img>
                </div>
            }
        </>
    );
};

export default SideMenu;
