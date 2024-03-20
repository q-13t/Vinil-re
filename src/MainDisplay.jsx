import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.png";
import { useEffect, useMemo, useReducer, useState } from "react";
import { invoke, path } from "@tauri-apps/api";
import Songs_List from "./Songs-List";
import Songs_Grid from "./Songs-Grid";
import AppData from "./main";
import getFolders from "./main";


const MainDisplay = () => {
    let navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    let [paths, setPaths] = useState([]);
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
                invoke("get_paths", { folders: folders }).then((res) => {
                    setPaths(res);
                })
            });
        }
    }, []);


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
                <select name="sort" id="sort">
                    <option value="Date Added">Date Added</option>
                    <option value="Title">Title</option>
                    <option value="Artist">Artist</option>
                </select>
            </div>

            <div id="MainSongContainer" {...(as === "grid" ? { className: "mainGrid" } : { className: "mainList" })}>
                {paths.length != 0 && as === "list" ?
                    paths.map((path) => {
                        odd = !odd; return <Songs_List path={path} odd={odd} />;
                    }) : paths.map((path) => (<Songs_Grid path={path} />))}
            </div>
        </div >
    );
};

export default MainDisplay;
