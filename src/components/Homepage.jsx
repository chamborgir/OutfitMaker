// components/Homepage.jsx
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const Homepage = () => {
    const navigate = useNavigate();

    return (
        <div className="container">
            <h2>Welcome!</h2>
            <button onClick={() => navigate("/upload")}>Upload Clothes</button>
            <button onClick={() => navigate("/outfit")}>Make an Outfit</button>
            <button onClick={() => navigate("/inventory")}>
                View Closet
            </button>
        </div>
    );
};

export default Homepage;
