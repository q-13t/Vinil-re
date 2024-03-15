import burgerImg from "./assets/Burger.png";
const SideMenu = () => {
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

                <div id="My Music" className="sideMenuButton">
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
                        <img id="AddPlayList" src={burgerImg} alt=""></img>
                    </div>
                    <div id="PlaylistsList">


                    </div>
                </div>
            </div>

            <div id="Setting" className="sideMenuButton">
                <img src={burgerImg} alt=""></img>
                <p className="sideMenuText">Settings</p>
            </div>
        </div>
    );
};

export default SideMenu;
