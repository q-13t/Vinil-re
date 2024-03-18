import FolderEl from "./FolderEl";
import burgerImg from "./assets/Burger.png";
const Settings = () => {

    function handleInputChange(event) {
        const files = event.target.files;
        let containsFolder = false;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type === '') {
                // If type is empty, it means it's a directory
                containsFolder = true;
                break;
            }
        }
        if (!containsFolder) {
            alert('Please select a folder.');
            event.target.value = null; // Reset the input value
        } else {
            // Do something with selected folders
            console.log(files);
        }
    };

    return (<div id="Settings">
        <input type="file" id="folderInput" style={{ display: 'none' }} webkitdirectory directory multiple onChange={{ handleInputChange }} />
        <h3>Settings</h3>
        <div id="AddFolderContainer" onClick={() => { document.getElementById("folderInput").click(); }}>
            <img src={burgerImg} alt={burgerImg} srcset="" />
            <p>Where to look for?</p>
        </div>
        <div id="FoldersContainer">

            {/* <FolderEl path="fakepath" /> */}


        </div>
    </div >);
}

export default Settings;