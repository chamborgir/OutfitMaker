import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "../supabase";
import "./Homepage.css";

const Homepage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/", { replace: true });
        } else {
            alert("Failed to log out.");
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                navigate("/", { replace: true });
            }
        };
        checkUser();
    }, [navigate]);

    return (
        <div className="container">
            <h2>
                <div className="title-name">
                    <span className="title-1">V</span>
                    <span className="title-2">Drobe</span>
                </div>
            </h2>{" "}
            <button onClick={() => navigate("/upload")}>Upload Clothes</button>
            <button onClick={() => navigate("/outfit")}>Make an Outfit</button>
            <button onClick={() => navigate("/inventory")}>View Closet</button>
            <button className="warning-button" onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

export default Homepage;
