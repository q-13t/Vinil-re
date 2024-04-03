
import playlistImg from "./assets/Playlist.svg";

const PlaylistPreview = ({ playlist, navigateTo, small = false }) => {

    return (
        <div id={playlist.path} key="PlayList" className="sideMenuButton" onClick={(e) => { navigateTo(e, `/playlist?name=${playlist.name}&path=${playlist.path}`); }}>

            {small
                ?
                <img src={playlistImg} ></img>
                :
                <>
                    <img src={playlistImg} alt="" aria-hidden="true" tabIndex={-1}></img>
                    <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>{playlist.name.replace(/\..*/mg, "")} </p>
                </>
            }

        </div >
    );
}

export default PlaylistPreview;

// {!small && <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>{playlist.name.replace(/\..*/mg, "")} </p>}
