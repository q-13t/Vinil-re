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
        const merger = audioContext.createChannelMerger(2);
        const splitter = audioContext.createChannelSplitter(2);
        let analyzer_left = audioContext.createAnalyser();
        let analyzer_right = audioContext.createAnalyser();

        audioSource.connect(splitter);
        splitter.connect(analyzer_left, 0);
        splitter.connect(analyzer_right, 1);
        analyzer_left.connect(merger, 0, 0);
        analyzer_right.connect(merger, 0, 1);
        merger.connect(audioContext.destination);

        analyzer_left.fftSize = 1024;
        analyzer_right.fftSize = 1024;
        const bufferLength = analyzer_right.frequencyBinCount;
        const dataArray_left = new Uint8Array(bufferLength);
        const dataArray_right = new Uint8Array(bufferLength);

        // const barWidth = ((canvas.width / 1.65) / (bufferLength));
        const linePos = canvas.width / 1.65;
        const canvasWidth = canvas.width;
        const canvasMid = canvas.width / 2;
        const canvasHeight = canvas.height;
        let barHeight = 0, x = 0, y = 0, i = 0;



        async function draw() { // audio visualization draw loop
            context.clearRect(0, 0, canvasWidth, canvasHeight);
            analyzer_left.getByteFrequencyData(dataArray_left);
            analyzer_right.getByteFrequencyData(dataArray_right);
            // draw lines left -> mid
            context.beginPath();
            context.lineTo(0, canvasHeight);
            barHeight = 0, x = 0, y = 0, i = 0;
            for (; i < bufferLength && x < canvasMid; i++) {
                barHeight = dataArray_left[i] / 2;
                x = (i / bufferLength) * linePos;
                y = canvasHeight - barHeight;
                context.lineTo(x, y);
            }
            // draw lines mid -> right
            context.lineTo(canvasMid, canvasHeight);
            for (let v = bufferLength - i, j = 0; v < bufferLength; v++, j++) {
                barHeight = dataArray_right[bufferLength - v] / 2;
                x = (j / bufferLength) * linePos + canvasMid;
                y = canvasHeight - barHeight;
                context.lineTo(x, y);
            }
            context.lineTo(canvasWidth, canvasHeight);
            context.fillStyle = getComputedStyle(document.body).getPropertyValue("--accent-color");
            context.fill();
            if (!draw_break) {
                requestAnimationFrame(draw);
            } else {
                context.clearRect(0, 0, canvasWidth, canvasHeight);
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