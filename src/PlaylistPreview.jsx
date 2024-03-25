import burgerImg from "./assets/Burger.png";

const PlaylistPreview = ({ playlist }) => {
    // console.log(playlist);
    return (
        <div id={playlist.path} key="PlayList" className="sideMenuButton">
            <img src={burgerImg} alt=""></img>
            <p className="sideMenuText">{playlist.name.replace(/\..*/mg, "")}</p>
        </div>
    );
}

export default PlaylistPreview;