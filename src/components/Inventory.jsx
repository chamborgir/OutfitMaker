import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Inventory.css";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const [clothes, setClothes] = useState([]);
    const [filter, setFilter] = useState("All");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClothes = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from("clothes")
                .select("*")
                .eq("user_id", user.id)
                .order("category", { ascending: true }); // sort by type

            if (error) {
                console.error("Error fetching clothes:", error);
            } else {
                setClothes(data);
            }
        };

        fetchClothes();
    }, []);

    // Filter by selected category
    const filtered =
        filter === "All"
            ? clothes
            : clothes.filter((item) => item.category === filter);

    const handleDelete = async (item) => {
        const url = item.img_url || item.image_url;
        if (!url) {
            console.error("No image URL found for item:", item);
            return;
        }

        const filename = url.split("/clothes/")[1];
        const fullPath = `${item.user_id}/${filename}`;

        const { error: removeError } = await supabase.storage
            .from("clothes")
            .remove([fullPath]);

        if (removeError) {
            console.error("Storage delete error:", removeError);
        }

        const { error: deleteError } = await supabase
            .from("clothes")
            .delete()
            .eq("id", item.id);

        if (deleteError) {
            console.error("DB delete error:", deleteError);
        }

        // Refresh
        setClothes(clothes.filter((c) => c.id !== item.id));
    };

    return (
        <div className="inventory-container">
            <button
                className="back-button"
                onClick={() => navigate("/homepage")}
            >
                Back to Homepage
            </button>
            <h2>Your Closet</h2>

            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="All">All</option>
                <option value="Hat">Hat</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Shoes">Shoes</option>
            </select>

            <div className="inventory-grid">
                {filtered.length > 0 ? (
                    filtered.map((item) => (
                        <div key={item.id} className="clothing-item">
                            <img
                                src={item.img_url}
                                alt={item.category}
                                width="100"
                                onError={(e) =>
                                    (e.target.src = "/placeholder.png")
                                } // fallback if image fails
                            />
                            <p>{item.category}</p>
                            <button onClick={() => handleDelete(item)}>
                                Delete
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No clothes uploaded yet.</p>
                )}
            </div>
        </div>
    );
};

export default Inventory;
