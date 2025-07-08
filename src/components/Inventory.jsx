import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import "./Inventory.css";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
    const [clothes, setClothes] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [deleteType, setDeleteType] = useState("");
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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
            setLoading(false);
        };

        fetchData();
    }, []);

    const confirmDelete = (item, type) => {
        setPendingDelete(item);
        setDeleteType(type);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        if (deleteType === "clothing") {
            const url = pendingDelete.img_url || pendingDelete.image_url;

            if (url) {
                const fullPath = new URL(url).pathname.split("/clothes/")[1];

                if (fullPath && pendingDelete.user_id) {
                    const { error: storageErr } = await supabase.storage
                        .from("clothes")
                        .remove([fullPath]);

                    if (storageErr) {
                        console.error(
                            "Failed to delete from storage:",
                            storageErr.message
                        );
                    }
                }
            }

            const { error } = await supabase
                .from("clothes")
                .delete()
                .eq("id", pendingDelete.id);

            if (error) {
                console.error("Failed to delete from DB:", error.message);
            } else {
                setClothes((prev) =>
                    prev.filter((c) => c.id !== pendingDelete.id)
                );
            }
        } else if (deleteType === "outfit") {
            const { error } = await supabase
                .from("outfits")
                .delete()
                .eq("id", pendingDelete.id);

            if (error) {
                console.error("Failed to delete outfit:", error.message);
            } else {
                setOutfits((prev) =>
                    prev.filter((o) => o.id !== pendingDelete.id)
                );
            }
        }

        setConfirmOpen(false);
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
            <div className="custom-select">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
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
            </div>

            {loading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : filter === "Outfits" ? (
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
                                        confirmDelete(outfit, "outfit")
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
                <div className="inventory-outer-grid">
                    {filteredClothes.length > 0 ? (
                        <div className="inventory-grid">
                            {filteredClothes.map((item) => (
                                <div key={item.id} className="clothing-item">
                                    <img
                                        src={item.img_url}
                                        alt={item.category}
                                        width="100"
                                        onClick={() => {
                                            setPreviewImage(item.img_url);
                                            setIsPreviewOpen(true);
                                        }}
                                        style={{ cursor: "pointer" }}
                                        onError={(e) =>
                                            (e.target.src = "/placeholder.png")
                                        }
                                    />
                                    <button
                                        onClick={() =>
                                            confirmDelete(item, "clothing")
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-items-message">
                            <p>No clothes uploaded yet.</p>
                        </div>
                    )}
                </div>
            )}

            {confirmOpen && (
                <div
                    className="confirm-modal-backdrop"
                    onClick={() => setConfirmOpen(false)}
                >
                    <div
                        className="confirm-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p>
                            Are you sure you want to delete this {deleteType}?
                        </p>
                        <button
                            className="warning-button"
                            onClick={handleConfirmDelete}
                        >
                            Delete
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {isPreviewOpen && (
                <div
                    className="preview-modal-backdrop"
                    onClick={() => setIsPreviewOpen(false)}
                >
                    <div
                        className="preview-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={previewImage} alt="Preview" />
                        <button
                            className="close-preview-btn"
                            onClick={() => setIsPreviewOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
