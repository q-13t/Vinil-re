import { listen } from "@tauri-apps/api/event";
import { appWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";


// let draw_break = false;
const AudioVisualizer = ({ player }) => {


    useEffect(() => {
        console.log("[AudioVisualizer] Loaded");

        let draw_break = false;
        const canvas = document.getElementById('PlayerControlsCanvas');
        const audioContext = new AudioContext();
        audioContext.resume();
        const context = canvas.getContext('2d');
        let audioSource = audioContext.createMediaElementSource(player);
        let analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);

        analyzer.fftSize = 1024;
        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = ((canvas.width / 1.65) / (bufferLength));

        let barHeight;
        let barPosition;

        async function draw() { // audio visualization draw loop
            barPosition = 0;
            context.clearRect(0, 0, canvas.width, canvas.height);
            analyzer.getByteFrequencyData(dataArray);
            let color = getComputedStyle(document.body).getPropertyValue("--accent-color");
            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                context.fillStyle = color;
                context.fillRect(barPosition, canvas.height - barHeight, barWidth, barHeight);
                context.fillRect(canvas.width - barPosition, canvas.height - barHeight, barWidth, barHeight);
                barPosition += barWidth;
            }
            if (!draw_break) {
                requestAnimationFrame(draw);
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }


        let unlisten;
        let checkVisualizer = async () => {
            const data = localStorage.getItem("visualizer");

            if (data === "On Window Focus") {
                unlisten = await appWindow.onFocusChanged(({ payload: focused }) => {
                    focused ? draw_break = false : draw_break = true;
                    console.log(`[onFocusChanged] focused?= ${focused}, draw_break= ${draw_break}`);
                    draw();
                })
                appWindow.emit('focus', { payload: true });
            } else {
                if (unlisten) unlisten();
                draw_break = data === "Always On" ? false : true;
            }
            console.log(`[checkVisualizer] mode= ${data}, draw_break= ${draw_break}`);
            draw();
        };

        checkVisualizer();
        window.addEventListener('storage', checkVisualizer);
        draw();
        return () => {
            window.removeEventListener('storage', checkVisualizer);
            if (unlisten) unlisten();
            draw_break = true;
            console.log("[AudioVisualizer] Unloaded");
        };
    }, [])
    return (<canvas id="PlayerControlsCanvas" ></canvas>);
}

export default AudioVisualizer;