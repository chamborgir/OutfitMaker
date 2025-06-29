// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import UploadClothes from "./components/UploadClothes";
import OutfitMaker from "./components/OutfitMaker";
import "./App.css";
import Register from "./components/Register.jsx";
import Inventory from "./components/Inventory";

// inside <Routes>
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/homepage" element={<Homepage />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/upload" element={<UploadClothes />} />
                <Route path="/outfit" element={<OutfitMaker />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
