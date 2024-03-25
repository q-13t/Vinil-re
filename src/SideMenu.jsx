import { useNavigate } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import { useEffect, useState } from "react";
import utils from "./main";
import PlaylistPreview from "./PlaylistPreview";

const SideMenu = ({ openDialog, playlists }) => {
    const navigate = useNavigate();

    const navigateTo = (link) => {
        navigate(link);
    }

    return (
        <div id="SideMenu">
            <div>
                <img id="sideMenuBurger" src={burgerImg} alt="" />
                <div id="SearchBar">
                    <input type="text" placeholder="Search" />
                    <img src={burgerImg} alt=""></img>
                    <img src={burgerImg} alt=""></img>
                </div>
            </div>
            <div id="MainScrollable" >

                <div id="My Music" className="sideMenuButton" onClick={() => navigateTo("/?display=My Music&as=list")}>
                    <img src={burgerImg} alt=""></img>
                    <p className="sideMenuText">My Music</p>
                </div>
                <div id="RecentList" className="sideMenuButton">
                    <img src={burgerImg} alt=""></img>
                    <p className="sideMenuText">Recent plays</p>
                </div>
                <div id="CurrentList" className="sideMenuButton">
                    <img src={burgerImg} alt=""></img>
                    <p className="sideMenuText">Now playing</p>
                </div>
                <div id="PlaylistsContainer">
                    <div id="Playlists">
                        <div id="PlaylistsButton" className="sideMenuButton" >
                            <img src={burgerImg} alt=""></img>
                            <p className="sideMenuText">Playlists</p>
                        </div>
                        <img id="AddPlayList" src={burgerImg} alt="" onClick={openDialog}></img>
                    </div>

                    <div id="PlaylistsList">
                        {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} />))}
                    </div>
                </div>
            </div>

            <div id="Setting" className="sideMenuButton" onClick={() => navigateTo("/settings")}>
                <img src={burgerImg} alt=""></img>
                <p className="sideMenuText">Settings</p>
            </div>
        </div>
    );
};

export default SideMenu;
