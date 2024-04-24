import burgerImg from "/Burger.svg";
import trashImg from "/TrashCan.svg";

const FolderEl = ({ path, removePath }) => {
    return (
        <div className="Folder" id={`${path}`}>
            <img src={trashImg} alt={burgerImg} onClick={() => removePath(path)} />
            <input type="text" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
    );
}

export default FolderEl;