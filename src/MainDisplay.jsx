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
            console.log(document.getElementById(`artist-${id}`).innerHTML);
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
                    const created = document.getElementById(`created-${id}`);
                    if (created) created.value = res[5];
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

    let fetchData = (event) => {
        getFolders().then((folders) => {
            invoke("get_paths", { folders: folders, sortBy: event.target.value }).then((res) => {
                console.log(res);
                setPaths(res);
            })
        });
    }


    return (
        <div id="MainDisplay">

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

            <div id="MainSongContainer" {...(as === "grid" ? { className: "mainGrid" } : { className: "mainList" })}>
                {paths.length != 0 && as === "list" ?
                    paths.map((path) => {
                        odd = !odd; return <Songs_List key={path} path={path} odd={odd} observer={observer} />;
                    }) : paths.map((path) => (<Songs_Grid key={path} path={path} observer={observer} />))}
            </div>
        </div >
    );
};

export default MainDisplay;
