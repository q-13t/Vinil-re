import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { invoke, path } from "@tauri-apps/api";
import Songs_List from "./Songs-List";
import Songs_Grid from "./Songs-Grid";
import AppData from "./main";
import getFolders from "./main";
import { restoreState } from "tauri-plugin-window-state-api";

async function isIntersecting(entries) {
    entries.forEach((entry) => {
        let id = entry.target.id;
        if (entry.isIntersecting) {
            async function fetchData() {
                const res = await invoke("get_tag", { path: id });
                if (res) {
                    const title = document.getElementById(`title-${id}`);
                    if (title) title.innerHTML = res[0];
                    const artist = document.getElementById(`artist-${id}`);
                    if (artist) artist.innerHTML = res[1];
                    const duration = document.getElementById(`duration-${id}`);
                    if (duration) duration.innerHTML = res[2];
                    const album = document.getElementById(`album-${id}`);
                    if (album) album.innerHTML = res[3];
                    const img = document.getElementById(`img-${id}`);
                    if (img) img.src = res[4] ? "data:image/webp;base64," + res[4] : burgerImg;

                    let container = document.getElementById(`${id}`);
                    container.setAttribute("data-title", res[0]);
                    container.setAttribute("data-artist", res[1]);
                    container.setAttribute("data-created", res[5].secs_since_epoch);
                }
            };
            fetchData();
        } else {
            const title = document.getElementById(`title-${id}`);
            if (title) title.innerHTML = null;
            const artist = document.getElementById(`artist-${id}`);
            if (artist) artist.innerHTML = null;
            const duration = document.getElementById(`duration-${id}`);
            if (duration) duration.innerHTML = null;
            const album = document.getElementById(`album-${id}`);
            if (album) album.innerHTML = null;
            const img = document.getElementById(`img-${id}`);
            if (img) img.src = null;
            const created = document.getElementById(`created-${id}`);
            if (created) created.value = null;
        }
    });
}

const MainDisplay = () => {
    let navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    let [paths, setPaths] = useState([]);
    let [observer, setObserver] = useState(new IntersectionObserver(isIntersecting));
    let [checked, setChecked] = useState([]);
    let display = queryParameters.get("display");
    let as = queryParameters.get("as");
    let odd = false;
    if (!display) { display = "My Music"; }
    if (!as) { as = "list"; }

    console.log(display, " : ", as);

    let navigateTo = (url) => {// /?display=[]&as=[]
        navigate(url);
    }

    useEffect(() => {
        if (display === "My Music") {
            getFolders().then((folders) => {
                console.log(folders);
                invoke("get_paths", { folders: folders, sortBy: "Time Created" }).then((res) => {
                    setPaths(res);
                })
            });
        }//Add rest 'display' types
    }, []);

    useEffect(() => {
        console.log(checked);
        if (checked.length != 0) {
            document.getElementById("selectedActions").style.display = "flex";
        } else {
            document.getElementById("selectedActions").style.display = "none";
        }
    }, [checked])

    let fetchData = (event) => {
        document.getElementById("sort").disabled = true;
        // let list = [];
        // list = document.getElementById("MainSongContainer");
        // // console.log(list);
        // switch (event.target.value) {
        //     case "Time Created": {
        //         [...list.children]
        //             .sort((a, b) => {
        //                 a.getAttribute("data-created") - b.getAttribute("data-created");
        //             }).forEach(node => console.log(node))
        //         break;
        //     }
        //     case "Title": {
        //         [...list.children]
        //             .sort((a, b) => {
        //                 a.getAttribute("data-title") - b.getAttribute("data-title");
        //             }).forEach(node => console.log(node))
        //         break;
        //     }
        //     case "Artist": {
        //         [...list.children]
        //             .sort((a, b) => {
        //                 a.getAttribute("data-artist") - b.getAttribute("data-artist");
        //             }).forEach(node => console.log(node))
        //         break;
        //     }

        //     default:
        //         break;
        // }
        // console.log(list);


        getFolders().then((folders) => {
            invoke("get_paths", { folders: folders, sortBy: event.target.value }).then((res) => {
                setPaths(res);
                document.getElementById("sort").disabled = false;
            })
        });
    }


    return (
        <div id="MainDisplay">
            <div id="topNav">
                <h3>{display}</h3>
                <div id="topSubNav">
                    <p onClick={() => navigateTo("?display=My Music&as=list")}>List</p>
                    <p onClick={() => navigateTo("?display=My Music&as=grid")}>Grid</p>
                </div>
                <div id="displaySort" >
                    <div id="shuffleButton">
                        <img src={burgerImg} alt={burgerImg}></img>
                        <p>Shuffle</p>
                    </div>
                    <select name="sort" id="sort" defaultValue={"Time Created"} onChange={(e) => { fetchData(e) }}>
                        <option value="Time Created">Time Created</option>
                        <option value="Title">Title</option>
                        <option value="Artist">Artist</option>
                    </select>
                </div>

                <div id="selectedActions" style={{ display: "none" }} >
                    <p onClick={() => { }}>Save To New Playlist</p>
                    <div id="main-existing-playlists-container">
                        <label htmlFor="main-existing-playlists">Add To Existing</label>
                        <select id="main-existing-playlists" name="main-existing-playlists">
                            <option value="none">None</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    </div>
                </div>
            </div>

            <div id="MainSongContainer" {...(as === "grid" ? { className: "mainGrid" } : { className: "mainList" })}>
                {paths.length != 0 && as === "list" ?
                    paths.map((path) => {
                        odd = !odd; return <Songs_List key={path} path={path} odd={odd} observer={observer} checked={checked} setChecked={setChecked} />;
                    }) : paths.map((path) => (<Songs_Grid key={path} path={path} observer={observer} />))}
            </div>
        </div >
    );
};

export default MainDisplay;
