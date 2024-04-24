
import playlistImg from "/Playlist.svg";

const PlaylistPreview = ({ playlist, navigateTo, small = false }) => {

    return (
        <div id={playlist.path} key="PlayList" className="sideMenuButton" title={playlist.name.replace(/\..*/mg, "")} onClick={(e) => { navigateTo(e, `/playlist?name=${playlist.name}&path=${playlist.path}`); }}>

            {small
                ?
                <img src={playlistImg} className="small-img" ></img>
                :
                <>
                    <img src={playlistImg} alt="" aria-hidden="true" tabIndex={-1} className="small-img"></img>
                    <p className="sideMenuText" aria-hidden="true" tabIndex={-1}>{playlist.name.replace(/\..*/mg, "")} </p>
                </>
            }

        </div >
    );
}

export default PlaylistPreview;
