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
            if (!draw_break) {
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
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);

            }
            requestAnimationFrame(draw);
        }

        let focus = (e) => {
            draw_break = false;
        };
        let blur = (e) => {
            draw_break = true;
        };

        let checkVisualizer = () => {
            const data = localStorage.getItem("visualizer");
            console.log(`[checkVisualizer] ${data}`);
            if (data === "On Window Focus") {
                window.addEventListener('focus', focus, true);
                window.addEventListener('blur', blur, true);
                window.dispatchEvent(new Event('focus'));
            } else {
                window.removeEventListener('focus', focus, true);
                window.removeEventListener('blur', blur, true);
                draw_break = data === "Always On" ? false : true;
            }
        };

        checkVisualizer();
        window.addEventListener('storage', checkVisualizer);
        draw();
        return () => {
            window.removeEventListener('storage', checkVisualizer);
            window.removeEventListener('focus', focus, true);
            window.removeEventListener('blur', blur, true);
        };
    }, [])
    return (<canvas id="PlayerControlsCanvas" ></canvas>);
}

export default AudioVisualizer;