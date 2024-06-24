import plusImg from "/Plus.svg";
import playlistImg from "/Playlist.svg";
import arrowImg from "/Arrows.svg";
import burgerImg from "/Burger.svg";

const DropDownMenu = ({ id, path, playlists, handleNewPlaylist, handleAddToPlaylist }) => {
    return (
        <div className="dropdown">
            <div className="song-button ">
                <img src={plusImg} alt={burgerImg} className="song-el-add max-height" ></img>
            </div>
            <div id={`song-el-add-control-${id}`} className="song-el-add-control">
                <div className="dropdown-control "  >
                    <div className=" dropdown-playlist dropdown-el" onClick={handleNewPlaylist}>
                        <div className="song-button">
                            <img src={plusImg} alt="" />
                        </div>
                        <p>Create New Playlist</p>
                    </div>
                    <div className="dropdown-playlist dropdown-el" onClick={() => { handlePlayNext(path) }}>
                        <img src={arrowImg} alt="" />
                        <p>Play Next</p>
                    </div>
                </div>
                {playlists && playlists.map((playlist) => (
                    <div className="dropdown-playlist dropdown-el" key={playlist.name} onClick={() => { handleAddToPlaylist(playlist.path) }}>
                        <div className="song-button">
                            <img src={playlistImg} ></img>
                        </div>

                        <p>{playlist.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DropDownMenu;