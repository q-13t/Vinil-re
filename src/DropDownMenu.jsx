import plusImg from "/Plus.svg";
import playlistImg from "/Playlist.svg";
import arrowImg from "/Arrows.svg";
import burgerImg from "/Burger.svg";
import { appendSong } from "./utils";

const DropDownMenu = ({ id, path, playlists, openDialog, setChecked, handlePlayNext }) => {

    let handleNewPlaylist = () => {
        setChecked([path]);
        openDialog(true);
    }

    let handleAddToPlaylist = (p_path) => {
        setChecked([path]);
        appendSong(p_path, [path]).then(() => {
            setChecked([]);
        });
    }

    let checkBoundaries = (e, id) => {
        let main = document.getElementById('MainContainer').clientHeight ?? 917;
        let drop = document.getElementById(`song-el-add-control-${id}`);
        if (!drop) return;
        let combined = drop.clientHeight + e.target.getBoundingClientRect().y;
        drop.style = main < combined ? `top: ${(main - combined) + 'px'}` : `top: 0px`;
    }

    return (
        <div className="dropdown" onMouseEnter={(e) => { checkBoundaries(e, id) }}>
            <div className="song-button ">
                <img src={plusImg} alt={burgerImg} className="song-el-add max-height" ></img>
            </div>
            <div id={`song-el-add-control-${id}`} className="song-el-add-control">
                <div className="dropdown-control "  >
                    <div className=" dropdown-playlist dropdown-el" onClick={handleNewPlaylist}>
                        <img src={plusImg} alt="" />
                        <p>Create New Playlist</p>
                    </div>
                    <div className="dropdown-playlist dropdown-el" onClick={() => { handlePlayNext(path) }}>
                        <img src={arrowImg} alt="" />
                        <p>Play Next</p>
                    </div>
                </div>
                {playlists && playlists.map((playlist) => (
                    <div className="dropdown-playlist dropdown-el" key={playlist.name} onClick={() => { handleAddToPlaylist(playlist.path) }}>
                        <img src={playlistImg} ></img>
                        <p>{playlist.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DropDownMenu;