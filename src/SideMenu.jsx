import { useNavigate } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import { useEffect, useState } from "react";
import funcs from "./main";

const SideMenu = ({ openDialog }) => {
    let [playlists, setPlaylists] = useState([]);
    const navigate = useNavigate();

    const navigateTo = (link) => {
        navigate(link);
    }
    // useEffect(() => {//Check dir and get dirs
    //     async function checkAndOrCreateDir() {
    //         await exists("Playlists", { dir: BaseDirectory.AppConfig }).then((exists) => {
    //             if (exists) {
    //                 readDir('Playlists', { dir: BaseDirectory.AppData, recursive: true }).then((entries) => {
    //                     for (const entry of entries) {
    //                         console.log(`Entry: ${entry.path}`);

    //                     }
    //                 });

    //             } else {
    //                 createDir('Playlists', { dir: BaseDirectory.AppData, recursive: true });
    //             }
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    //     }
    //     checkAndOrCreateDir();
    // }, []);

    useEffect(() => {
        funcs.getPlaylists().then((playlists) => {
            if (playlists.length > 0) {
                setPlaylists(playlists);
            }
        })

    }, [])
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
                        {playlists && playlists.map((playlist) => (
                            <div key="PlayList" className="sideMenuButton">
                                <img src={burgerImg} alt=""></img>
                                <p className="sideMenuText">{playlist.name}</p>
                            </div>
                        ))}

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
