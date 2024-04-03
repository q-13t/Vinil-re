
import playlistImg from "./assets/Playlist.svg";

const PlaylistPreview = ({ playlist, navigateTo, small = false }) => {

    return (
        <div id={playlist.path} key="PlayList" className="sideMenuButton" onClick={() => { navigateTo(`/playlist?name=${playlist.name}&path=${playlist.path}`); }}>
            <img src={playlistImg} alt=""></img>
            {!small && <p className="sideMenuText">{playlist.name.replace(/\..*/mg, "")}</p>}
        </div>
    );
}

export default PlaylistPreview;