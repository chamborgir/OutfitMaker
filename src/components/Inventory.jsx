import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Inventory.css";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const [clothes, setClothes] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const [{ data: clothesData }, { data: outfitsData }] =
                await Promise.all([
                    supabase
                        .from("clothes")
                        .select("*")
                        .eq("user_id", user.id)
                        .order("category", { ascending: true }),

                    supabase.from("outfits").select("*").eq("user_id", user.id),
                ]);

            setClothes(clothesData || []);
            setOutfits(outfitsData || []);
        };

        fetchData();
    }, []);

    const handleDeleteClothing = async (item) => {
        const url = item.img_url || item.image_url;
        if (!url) return;

        const filename = url.split("/clothes/")[1];
        const fullPath = `${item.user_id}/${filename}`;

        await supabase.storage.from("clothes").remove([fullPath]);
        await supabase.from("clothes").delete().eq("id", item.id);

        setClothes((prev) => prev.filter((c) => c.id !== item.id));
    };

    const handleDeleteOutfit = async (id) => {
        await supabase.from("outfits").delete().eq("id", id);
        setOutfits((prev) => prev.filter((o) => o.id !== id));
    };

    const filteredClothes =
        filter === "All"
            ? clothes
            : filter === "Outfits"
            ? []
            : clothes.filter((item) => item.category === filter);

    return (
        <div className="inventory-container">
            <div className="header-nav">
                <h2>Your Closet</h2>
                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
            </div>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Hat">Hat</option>
                <option value="Accessories">Accessories</option>
                <option value="Outerwear">Outerwear</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Shoes">Shoes</option>
                <option value="Bag">Bag</option>
                <option value="Outfits">Outfits</option>
            </select>

            {filter === "Outfits" ? (
                <div className="inventory-grid">
                    {outfits.length > 0 ? (
                        outfits.map((outfit) => (
                            <div key={outfit.id} className="clothing-item">
                                {outfit.hat && (
                                    <img
                                        src={outfit.hat}
                                        alt="Hat"
                                        width="60"
                                    />
                                )}
                                {outfit.accessories && (
                                    <img
                                        src={outfit.accessories}
                                        alt="Accessories"
                                        width="60"
                                    />
                                )}

                                {outfit.outerwear && (
                                    <img
                                        src={outfit.outerwear}
                                        alt="Outerwear"
                                        width="60"
                                    />
                                )}
                                {outfit.top && (
                                    <img
                                        src={outfit.top}
                                        alt="Top"
                                        width="60"
                                    />
                                )}
                                {outfit.bottom && (
                                    <img
                                        src={outfit.bottom}
                                        alt="Bottom"
                                        width="60"
                                    />
                                )}
                                {outfit.shoes && (
                                    <img
                                        src={outfit.shoes}
                                        alt="Shoes"
                                        width="60"
                                    />
                                )}
                                {outfit.bag && (
                                    <img
                                        src={outfit.bag}
                                        alt="Bag"
                                        width="60"
                                    />
                                )}
                                <button
                                    onClick={() =>
                                        handleDeleteOutfit(outfit.id)
                                    }
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No outfits saved yet.</p>
                    )}
                </div>
            ) : (
                <div className="inventory-grid">
                    {filteredClothes.length > 0 ? (
                        filteredClothes.map((item) => (
                            <div key={item.id} className="clothing-item">
                                <img
                                    src={item.img_url}
                                    alt={item.category}
                                    width="100"
                                    onError={(e) =>
                                        (e.target.src = "/placeholder.png")
                                    }
                                />
                                <p>{item.category}</p>
                                <button
                                    onClick={() => handleDeleteClothing(item)}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No clothes uploaded yet.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Inventory;
