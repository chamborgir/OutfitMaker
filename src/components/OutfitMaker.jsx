import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./OutfitMaker.css"; // make sure to style modal here

const OutfitMaker = () => {
    const [hat, setHat] = useState(null);
    const [accessories, setAccessories] = useState(null);
    const [outerwear, setOuterwear] = useState(null);
    const [top, setTop] = useState(null);
    const [bottom, setBottom] = useState(null);
    const [shoes, setShoes] = useState(null);
    const [bag, setBag] = useState(null);
    const [clothes, setClothes] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState({
        label: "",
        setter: null,
    });

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
            Outerwear: setOuterwear,
            Top: setTop,
            Bottom: setBottom,
            Shoes: setShoes,
            Bag: setBag,
        }[activeCategory];
        if (setter) setter(url);
        closeModal();
    };

    const confirmRemove = (label, setter) => {
        setConfirmTarget({ label, setter });
        setConfirmModalOpen(true);
    };

    const handleConfirmRemove = () => {
        confirmTarget.setter(null);
        setConfirmModalOpen(false);
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
        setOuterwear(getRandom("Outerwear"));
        setTop(getRandom("Top"));
        setBottom(getRandom("Bottom"));
        setShoes(getRandom("Shoes"));
        setBag(getRandom("Bag"));
    };

    const handleSaveOutfit = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("Not logged in");
            return;
        }

        const { error } = await supabase.from("outfits").insert([
            {
                user_id: user.id,
                hat,
                accessories,
                outerwear,
                top,
                bottom,
                shoes,
                bag,
            },
        ]);

        if (error) {
            console.error("Error saving outfit:", error);
            alert("Failed to save outfit.");
        } else {
            setSuccessModalOpen(true); // ✅ Show modal
        }
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
                {[
                    "Hat",
                    "Accessories",
                    "Outerwear",
                    "Top",
                    "Bottom",
                    "Shoes",
                    "Bag",
                ].map((cat) => (
                    <div key={cat}>
                        <button onClick={() => openModal(cat)}>
                            Choose {cat}
                        </button>
                    </div>
                ))}
            </div>

            <hr className="section-divider" />

            <div className="preview">
                <h3>Outfit Preview:</h3>

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
                    {outerwear && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() =>
                                confirmRemove("Outerwear", setOuterwear)
                            }
                        >
                            <img src={outerwear} width="180" alt="Top" />
                        </div>
                    )}
                    {top && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Top", setTop)}
                        >
                            <img src={top} width="180" alt="Top" />
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
                    {bag && (
                        <div
                            className="preview-img-wrapper"
                            onClick={() => confirmRemove("Bag", setBag)}
                        >
                            <img src={bag} width="150" alt="Top" />
                        </div>
                    )}
                </div>
                <button className="randomize-button" onClick={handleRandomize}>
                    Randomize Outfit
                </button>
                <button className="save-button" onClick={handleSaveOutfit}>
                    Save Outfit
                </button>
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

            {confirmModalOpen && (
                <div
                    className="modal-backdrop"
                    onClick={() => setConfirmModalOpen(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Remove {confirmTarget.label}?</h3>
                        <p>
                            This will remove the selected {confirmTarget.label}{" "}
                            from the preview.
                        </p>
                        <div
                            style={{
                                marginTop: "1rem",
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <button onClick={handleConfirmRemove}>
                                Yes, Remove
                            </button>
                            <button onClick={() => setConfirmModalOpen(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {successModalOpen && (
                <div
                    className="modal-backdrop"
                    onClick={() => setSuccessModalOpen(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Outfit Saved!</h3>
                        <p>
                            Your outfit was successfully added to your closet.
                        </p>
                        <button onClick={() => setSuccessModalOpen(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutfitMaker;
