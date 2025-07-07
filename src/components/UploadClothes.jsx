import { useState } from "react";
import { supabase } from "../supabase";
import "./UploadClothes.css";

const UploadClothes = () => {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("Top");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        if (isLoading) return; // prevent double uploads
        setIsLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("User not logged in");
            setIsLoading(false);
            return;
        }

        if (!file) {
            alert("No file selected");
            setIsLoading(false);
            return;
        }

        const filePath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
            .from("clothes")
            .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            alert("Error uploading file");
            setIsLoading(false);
            return;
        }

        const { data: urlData } = supabase.storage
            .from("clothes")
            .getPublicUrl(filePath);

        const imageUrl = urlData?.publicUrl;

        const { error: insertError } = await supabase.from("clothes").insert([
            {
                user_id: user.id,
                img_url: imageUrl,
                storage_path: filePath, // ✅ Save exact storage path
                category: category,
                created_at: new Date().toISOString(),
            },
        ]);

        if (insertError) {
            console.error("Insert error:", insertError);
            alert("Error saving image metadata");
            setIsLoading(false);
            return;
        }

        // Reset states
        setFile(null);
        setIsLoading(false);
        setShowModal(true);
    };

    return (
        <div className="upload-container">
            <div className="header-nav">
                <h2>Upload Clothes</h2>
                <button
                    className="back-button"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
            </div>
            <div className="custom-file-upload">
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    disabled={isLoading}
                />
            </div>
            <div className="custom-select">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isLoading}
                >
                    <option value="Hat">Hat</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Outerwear">Outerwear</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bag">Bag</option>
                </select>
            </div>

            <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={isLoading}
            >
                {isLoading ? "Uploading..." : "Upload"}
            </button>

            {isLoading && (
                <div className="loading-spinner">
                    <div className="spinner" />
                </div>
            )}

            {showModal && (
                <div
                    className="modal-backdrop"
                    onClick={() => setShowModal(false)}
                >
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Upload Successful!</h3>
                        <p>Your item was uploaded successfully.</p>
                        <button
                            className="modal-close"
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadClothes;
