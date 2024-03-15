import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
const MainSongList = () => {
    let [data, updateData] = useState([]);
    let [forceUpdate, updateForceUpdate] = useState(0);
    let frag = document.createDocumentFragment();

    // useEffect on main window
    // useEffect(() => {
    //     invoke("get_paths", {}).then((paths) => {
    //         paths.forEach(path => {
    //             invoke("get_tag", { path: path }).then((tag) => {
    //                 data.push(tag);
    //                 updateData([...data]);
    //             });
    //         });
    //     });
    // }, []);

    let testFill = () => {
        invoke("get_paths", {}).then((paths) => {
            paths.forEach((path) => {
                invoke("get_tag", { path: path }).then((tag) => {
                    data.push(tag);
                    updateData([...data]);
                });
            });
        });
    };

    let clearTest = () => {
        updateData([]);
    };

    return (
        <div id="test">
            <button onClick={() => testFill()}>run</button>
            <button onClick={() => clearTest()}>clear</button>
            <div id="container">{data && data.map((item) => <div>{item}</div>)}</div>
        </div>
    );
};

export default MainSongList;
