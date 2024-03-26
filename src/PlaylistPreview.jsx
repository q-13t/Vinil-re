
import burgerImg from "./assets/Burger.png";

const PlaylistPreview = ({ playlist, navigateTo }) => {

    return (
        <div id={playlist.path} key="PlayList" className="sideMenuButton" onClick={() => { navigateTo(`/playlist?name=${playlist.name}&path=${playlist.path}`) }}>
            <img src={burgerImg} alt=""></img>
            <p className="sideMenuText">{playlist.name.replace(/\..*/mg, "")}</p>
        </div>
    );
}

export default PlaylistPreview;