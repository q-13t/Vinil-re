import burgerImg from "/Burger.svg";
import trashImg from "/TrashCan.svg";

const FolderEl = ({ path, removePath }) => {
    return (
        <div className="Folder" id={`${path}`}>
            <div className="control-button delete" style={{ maxHeight: "100%" }}>
                <img src={trashImg} alt={burgerImg} onClick={() => removePath(path)} />
            </div>
            <input type="text" value={path} onChange={(e) => setPath(e.target.value)} />
        </div>
    );
}

export default FolderEl;