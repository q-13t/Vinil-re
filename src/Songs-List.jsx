import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";
import { useEffect, useRef, useState } from "react";

const Songs_List = ({ path, odd }) => {
    const ref = useRef(null);
    // title artist duration album picture
    let [data, updateData] = useState([]);

    useEffect(() => {
        const observer = new IntersectionObserver(async (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const fetchData = async () => {
                        const res = await invoke("get_tag", { path });
                        if (res) {
                            updateData(res);
                            console.log(res);
                        }
                    };
                    fetchData();
                } else {
                    updateData([]);
                }
            });
        });
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        }
    }, []);

    return (
        <div key={path} ref={ref} className={`song-el-container-list ${odd ? "odd" : ""}`}  >
            <div className="song-el-check"></div>
            <img id={`img-${path}`} src={data[4] ? "data:image/webp;base64," + data[4] : burgerImg} className="song-el-album"></img>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", flex: "0 0 20%", maxWidth: "20%" }}>
                <p className="song-el-title">{data[0]}</p>
                <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
            </div >
            <p className="song-el-artist">{data[1]}</p>
            <p className="song-el-album">{data[3]}</p>
            <p className="song-el-time">{data[2]}</p>
        </div>
    );
}


export default Songs_List;