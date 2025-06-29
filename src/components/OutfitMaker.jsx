import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./OutfitMaker.css"; // make sure to style modal here

const OutfitMaker = () => {
    const [hat, setHat] = useState(null);
    const [accessories, setAccessories] = useState(null);
    const [top, setTop] = useState(null);
    const [bottom, setBottom] = useState(null);
    const [shoes, setShoes] = useState(null);
    const [clothes, setClothes] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");

    useEffect(() => {
        const fetchClothes = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("clothes")
                .select("*")
                .eq("user_id", user.id);

            if (error) {
                console.error("Error fetching clothes:", error);
                return;
            }

            setClothes(data);
        };

        fetchClothes();
    }, []);

    const openModal = (category) => {
        setActiveCategory(category);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setActiveCategory("");
    };

    const handleSelect = (url) => {
        const setter = {
            Hat: setHat,
            Accessories: setAccessories,
            Top: setTop,
            Bottom: setBottom,
            Shoes: setShoes,
        }[activeCategory];
        if (setter) setter(url);
        closeModal();
    };

    const confirmRemove = (label, setter) => {
        if (window.confirm(`Remove ${label}?`)) setter(null);
    };

    const getByCategory = (category) =>
        clothes.filter((item) => item.category === category);

    const handleRandomize = () => {
        const getRandom = (category) => {
            const items = getByCategory(category);
            if (items.length === 0) return null;
            const randomIndex = Math.floor(Math.random() * items.length);
            return items[randomIndex].img_url;
        };

        setHat(getRandom("Hat"));
        setAccessories(getRandom("Accessories"));
        setTop(getRandom("Top"));
        setBottom(getRandom("Bottom"));
        setShoes(getRandom("Shoes"));
    };

    return (
        <div className="container">
            <div className="header-nav">
                <h2>Outfit Maker</h2>
                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
            </div>

            <div className="upload-bin">
                {["Hat", "Accessories", "Top", "Bottom", "Shoes"].map((cat) => (
                    <div key={cat}>
                        <h4>{cat}</h4>
                        <button onClick={() => openModal(cat)}>
                            Choose {cat}
                        </button>
                    </div>
                ))}
            </div>

            <div className="preview">
                <h3>Outfit Preview:</h3>
                <button className="randomize-button" onClick={handleRandomize}>
                    Randomize Outfit
                </button>
                <div className="preview-column">
                    {hat && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Hat", setHat)}
                        >
                            <img src={hat} width="150" alt="Hat" />
                        </div>
                    )}
                    {accessories && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() =>
                                confirmRemove("Accessories", setAccessories)
                            }
                        >
                            <img
                                src={accessories}
                                width="150"
                                alt="Accessories"
                            />
                        </div>
                    )}
                    {top && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Top", setTop)}
                        >
                            <img src={top} width="150" alt="Top" />
                        </div>
                    )}
                    {bottom && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Bottom", setBottom)}
                        >
                            <img src={bottom} width="150" alt="Bottom" />
                        </div>
                    )}
                    {shoes && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Shoes", setShoes)}
                        >
                            <img src={shoes} width="150" alt="Shoes" />
                        </div>
                    )}
                </div>
            </div>

            {modalOpen && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Select {activeCategory}</h3>
                        <div className="modal-grid">
                            {getByCategory(activeCategory).map((item) => (
                                <img
                                    key={item.id}
                                    src={item.img_url}
                                    alt={activeCategory}
                                    onClick={() => handleSelect(item.img_url)}
                                    className="modal-image"
                                    width="100"
                                />
                            ))}
                        </div>
                        <button onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutfitMaker;
