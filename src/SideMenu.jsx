import burgerImg from "./assets/Burger.svg";
import PlaylistPreview from "./PlaylistPreview";
import gearImg from "./assets/Gear.svg";
import plusImg from "./assets/Plus.svg";
import clockImg from "./assets/Clock.svg";
import arrowsImg from "./assets/Arrows.svg";
import XImg from "./assets/X.svg";
import searchImg from "./assets/Search.svg";
import { useEffect, useState } from "react";
import barsImg from "./assets/Bars.svg";
import { getFolders } from "./utils";

const SideMenu = ({ openDialog, playlists, navigateTo, setDisplay }) => {
    let [search, setSearch] = useState("");
    let [maximized, setMaximized] = useState(true);
    let [lastNav, setLastNav] = useState();
    useEffect(() => {
        // console.log(lastNav);


        if (lastNav) {
            let el = document.getElementById(lastNav.id);
            if (!el.classList.contains("activeBorder-right")) {
                el.classList.add("activeBorder-right");
                setLastNav(el);
            }
        } else {
            getFolders().then((folders) => {
                if (folders.length > 0) {
                    const my_mus = document.getElementById("My Music");
                    if (my_mus) my_mus.click();
                }
                else {
                    const setting = document.getElementById("Settings");
                    if (setting) setting.click();
                }
            })
        }
    }, [maximized]);

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
    // handleNavigate(e, "/?display=Recent Plays&as=list")}
    return (
        <>

            {maximized
                ?
                <div id="SideMenu">
                    <progress style={{ width: "100%", }} id="indexing-progress" type="range" min="0" max="100" />
                    < div >
                        <img id="sideMenuBurger" src={burgerImg} alt="" onClick={() => { setMaximized(false); }} />
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
                                <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog} className="small-img"></img>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} />))}
                            </div>
                        </div>
                    </div>

                    <div id="Settings" className="sideMenuButton" onClick={(e) => handleNavigate(e, "/settings")}>
                        <img src={gearImg} alt="" aria-hidden="true" tabIndex={-1}></img>
                        <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Settings</p>
                    </div>
                </div >
                :
                <div id="SideMenu-small">
                    <progress style={{ width: "100%", }} id="indexing-progress" type="range" min="0" max="100" />
                    <img id="sideMenuBurger" src={burgerImg} alt="" onClick={() => { setMaximized(true); }} />
                    <div id="MainScrollable">
                        <img id="My Music" title="My Music" src={barsImg} alt={burgerImg} className="sideMenuButton small-img" onClick={(e) => { setDisplay("My Music"); handleNavigate(e, "/") }} ></img>
                        <img id="RecentList" title="Recent Plays" src={clockImg} alt={burgerImg} className="sideMenuButton small-img" onClick={(e) => { setDisplay("Recent Plays"); handleNavigate(e, "/") }}></img>
                        <img id="CurrentList" title="Current Play Queue" src={arrowsImg} alt={burgerImg} className="sideMenuButton small-img" onClick={(e) => { setDisplay("Current Play Queue"); handleNavigate(e, "/") }} ></img>
                        <div id="PlaylistsContainer">
                            <div id="Playlists" style={{ justifyContent: "center" }}>
                                <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog}></img>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} small={true} />))}
                            </div>
                        </div>
                    </div>
                    <div id="Settings" >
                        <img src={gearImg} alt={burgerImg} className="sideMenuButton small-img" onClick={(e) => handleNavigate(e, "/settings")}></img>
                    </div>
                </div>
            }
        </>
    );
};

export default SideMenu;
