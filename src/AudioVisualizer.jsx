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
        let barHeight;
        let barPosition;



        async function draw() { // audio visualization draw loop
            barPosition = 0;

            context.clearRect(0, 0, canvas.width, canvas.height);
            analyzer_left.getByteFrequencyData(dataArray_left);
            analyzer_right.getByteFrequencyData(dataArray_right);
            let color = getComputedStyle(document.body).getPropertyValue("--accent-color");

            context.beginPath();
            context.moveTo(0, canvas.height);

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray_left[i] / 2;
                let x = (i / bufferLength) * linePos;
                let y = canvas.height - barHeight;
                context.lineTo(x, y);
            }
            context.moveTo(canvas.width, canvas.height);
            for (let i = bufferLength - 1; i >= 0; i--) {
                barHeight = dataArray_right[i] / 2;
                let x = (i / bufferLength) * linePos;
                let y = canvas.height - barHeight;
                context.lineTo(canvas.width - x, y);
            }

            // context.lineTo(canvas.width, canvas.height);
            context.fillStyle = color;
            context.fill();

            // barPosition = 0;

            // context.clearRect(0, 0, canvas.width, canvas.height);
            // analyzer_left.getByteFrequencyData(dataArray_left);
            // analyzer_right.getByteFrequencyData(dataArray_right);
            // let color = getComputedStyle(document.body).getPropertyValue("--accent-color");
            // for (let i = 0; i < bufferLength; i++) {
            //     barHeight = dataArray_left[i] / 2;
            //     context.fillStyle = color;
            //     context.fillRect(barPosition, canvas.height - barHeight, barWidth, barHeight);
            //     barHeight = dataArray_right[i] / 2;
            //     context.fillRect(canvas.width - barPosition, canvas.height - barHeight, barWidth, barHeight);
            //     barPosition += barWidth;
            // }
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