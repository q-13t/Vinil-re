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

const SideMenu = ({ openDialog, playlists, navigateTo }) => {
    let [search, setSearch] = useState("");
    let [maximized, setMaximized] = useState(true);
    let [lastNav, setLastNav] = useState();
    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth < 1200) {
                setMaximized(false);
            } else {
                setMaximized(true);
            }
        })
        if (lastNav) {
            if (!lastNav.classList.contains("activeBorder-right"))
                lastNav.classList.add("activeBorder-right");
        } else {
            document.getElementById("My Music").click();
        }
        return () => {
            window.removeEventListener("resize", () => {
                if (window.innerWidth < 1200) {
                    setMaximized(false);
                } else {
                    setMaximized(true);
                }
            })
        }
    }, [maximized]);

    let handleNavigate = (event, path) => {
        console.log(event.target, path);
        if (lastNav) lastNav.classList.toggle("activeBorder-right");//turn off border highlight
        setLastNav(event.target);
        event.target.classList.toggle("activeBorder-right");//turn on border highlight
        navigateTo(path);
    }

    return (
        <>
            {maximized
                ?
                <div id="SideMenu">
                    < div >
                        <img id="sideMenuBurger" src={burgerImg} alt="" onClick={() => { setMaximized(false); }} />
                        <div id="SearchBar">
                            <input id="search-Input" type="text" placeholder="Search" value={search} onChange={(e) => { setSearch(e.target.value); }} />
                            <img id="search-Search" style={{ display: search === "" ? "none" : "block" }} src={searchImg} alt={burgerImg} onClick={(e) => navigateTo(`/?display=Search Results&as=list&search-for=${search}`)}></img>
                            <img id="search-Clear" style={{ display: search === "" ? "none" : "block" }} src={XImg} alt={burgerImg} onClick={() => { setSearch(""); }} ></img>
                        </div>
                    </div >
                    <div id="MainScrollable" >

                        <div id="My Music" className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=My Music&as=list")}>
                            <img src={barsImg} alt={burgerImg} aria-hidden="true" tabIndex={-1}></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>My Music</p>
                        </div>
                        <div id="RecentList" className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=Recent Plays&as=list")}>
                            <img src={clockImg} alt={burgerImg} aria-hidden="true" tabIndex={-1}></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Recent plays</p>
                        </div>
                        <div id="CurrentList" className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=Current Play Queue&as=list")}>
                            <img src={arrowsImg} alt={burgerImg} aria-hidden="true" tabIndex={-1}></img>
                            <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Now playing</p>
                        </div>
                        <div id="PlaylistsContainer">
                            <div id="Playlists">
                                <div id="PlaylistsButton"  >
                                    <img src={burgerImg} alt="" aria-hidden="true" tabIndex={-1}></img>
                                    <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Playlists</p>
                                </div>
                                <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog}></img>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} />))}
                            </div>
                        </div>
                    </div>

                    <div id="Setting" className="sideMenuButton" onClick={(e) => handleNavigate(e, "/settings")}>
                        <img src={gearImg} alt="" aria-hidden="true" tabIndex={-1}></img>
                        <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>Settings</p>
                    </div>
                </div >
                :
                <div id="SideMenu-small">
                    <img id="sideMenuBurger" src={burgerImg} alt="" onClick={() => { setMaximized(true); }} />
                    <div id="MainScrollable">
                        <img id="My Music" src={barsImg} alt={burgerImg} className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=My Music&as=list")} ></img>
                        <img id="RecentList" src={clockImg} alt={burgerImg} className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=Recent Plays&as=list")}></img>
                        <img id="CurrentList" src={arrowsImg} alt={burgerImg} className="sideMenuButton" onClick={(e) => handleNavigate(e, "/?display=Current Play Queue&as=list")} ></img>
                        <div id="PlaylistsContainer">
                            <div id="Playlists" style={{ justifyContent: "center" }}>
                                <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog}></img>
                            </div>

                            <div id="PlaylistsList">
                                {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={handleNavigate} small={true} />))}
                            </div>
                        </div>
                    </div>
                    <div id="Setting" >
                        <img src={gearImg} alt={burgerImg} className="sideMenuButton" onClick={(e) => handleNavigate(e, "/settings")}></img>
                    </div>
                </div>
            }
        </>
    );
};

export default SideMenu;
