import { useEffect } from "react";

const AudioVisualizer = ({ player }) => {
    useEffect(() => {
        //  Audio Visualizer

        const canvas = document.getElementById('PlayerControlsCanvas');
        const audioContext = new AudioContext();
        audioContext.resume();
        const context = canvas.getContext('2d');
        let audioSource;
        let analyzer;
        if (!audioSource) audioSource = audioContext.createMediaElementSource(player);
        analyzer = audioContext.createAnalyser();
        audioSource.connect(analyzer);
        analyzer.connect(audioContext.destination);
        analyzer.fftSize = 1024;
        const bufferLength = analyzer.frequencyBinCount; // fftSize / 2
        const dataArray = new Uint8Array(bufferLength);
        const barWidth = ((canvas.width / 1.65) / (bufferLength));

        let barHeight;
        let barPosition;
        let break_draw = false;

        const draw = async () => { // audio visualization draw loop
            console.log(break_draw);
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

            if (!break_draw) {
                requestAnimationFrame(draw);
            } else {
                context.clearRect(0, 0, canvas.width, canvas.height);
                break_draw = false;
            }
        }

        window.addEventListener('focus', (event) => { break_draw = false; draw(); });
        window.addEventListener('blur', (event) => { break_draw = true; });

        draw();
    }, []);
    return (
        <canvas id="PlayerControlsCanvas"  ></canvas>
    );
}

export default AudioVisualizer;