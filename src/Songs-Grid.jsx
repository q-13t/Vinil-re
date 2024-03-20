import { invoke } from "@tauri-apps/api";
import burgerImg from "./assets/Burger.png";
import { useEffect, useRef, useState } from "react";

const Songs_Grid = ({ path }) => {
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
        <div key={path} ref={ref} className="song-el-container-grid"  >
            <img id={`img-${path}`} src={data[4] ? "data:image/webp;base64," + data[4] : burgerImg} className="song-el-album"></img>

            <p className="song-el-title">{data[0]}</p>
            <div style={{ width: "90%", display: "flex", justifyContent: "space-between" }}>
                <p className="song-el-artist">{data[1]}</p>
                <p className="song-el-time">{data[2]}</p>
            </div>

            <div className="song-el-buttons">
                <img src={burgerImg} alt={burgerImg} className="song-el-play"></img>
                <img src={burgerImg} alt={burgerImg} className="song-el-add"></img>
            </div >
        </div >
    );
}

export default Songs_Grid;