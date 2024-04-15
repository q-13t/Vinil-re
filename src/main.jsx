import ReactDOM from "react-dom/client";
import "./index.css";
import MainWindow from "./MainWindow";
import { BrowserRouter } from "react-router-dom";



// Get rid of annoying warning
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <MainWindow />
    </BrowserRouter>
);