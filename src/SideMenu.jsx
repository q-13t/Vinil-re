import burgerImg from "./assets/Burger.svg";
import PlaylistPreview from "./PlaylistPreview";
import gearImg from "./assets/Gear.svg";
import plusImg from "./assets/Plus.svg";
const SideMenu = ({ openDialog, playlists, navigateTo }) => {


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
                <div id="RecentList" className="sideMenuButton" onClick={() => navigateTo("/?display=Recent Plays&as=list")}>
                    <img src={burgerImg} alt=""></img>
                    <p className="sideMenuText">Recent plays</p>
                </div>
                <div id="CurrentList" className="sideMenuButton" onClick={() => navigateTo("/?display=Current Play Queue&as=list")}>
                    <img src={burgerImg} alt=""></img>
                    <p className="sideMenuText">Now playing</p>
                </div>
                <div id="PlaylistsContainer">
                    <div id="Playlists">
                        <div id="PlaylistsButton"  >
                            <img src={burgerImg} alt=""></img>
                            <p className="sideMenuText">Playlists</p>
                        </div>
                        <img id="AddPlayList" src={plusImg} alt="" onClick={openDialog}></img>
                    </div>

                    <div id="PlaylistsList">
                        {playlists && playlists.map((playlist) => (<PlaylistPreview key={playlist.name} playlist={playlist} navigateTo={navigateTo} />))}
                    </div>
                </div>
            </div>

            <div id="Setting" className="sideMenuButton" onClick={() => navigateTo("/settings")}>
                <img src={gearImg} alt=""></img>
                <p className="sideMenuText">Settings</p>
            </div>
        </div>
    );
};

export default SideMenu;
