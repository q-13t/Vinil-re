import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import burgerImg from "./assets/Burger.png";


const MainDisplay = () => {
    let navigate = useNavigate();
    const [queryParameters] = useSearchParams();
    let display = queryParameters.get("display");
    let as = queryParameters.get("as");

    if (!display) { display = "My Music"; }
    if (!as) { as = "list"; }

    console.log(display, as);

    let navigateTo = (url) => {// /?display=[]&as=[]
        navigate(url);
    }

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
            <div id="MainSongContainer">

            </div>

        </div>
    );
};

export default MainDisplay;
