import { useState } from "react";
import { supabase } from "../supabase";
import "./UploadClothes.css"; // ✅ Import the CSS file

const UploadClothes = () => {
    const [file, setFile] = useState(null);
    const [category, setCategory] = useState("Top");
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpload = async () => {
        setIsLoading(true);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            alert("User not logged in");
            return;
        }

        if (!file) {
            alert("No file selected");
            return;
        }

        const filename = `${user.id}/${Date.now()}_${file.name}`;
        console.log("Uploading file as:", filename);

        const { error: uploadError } = await supabase.storage
            .from("clothes")
            .upload(filename, file, {
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            alert("Error uploading file");
            return;
        }

        const { data: urlData } = supabase.storage
            .from("clothes")
            .getPublicUrl(filename);

        const imageUrl = urlData?.publicUrl;

        const { error: insertError } = await supabase.from("clothes").insert([
            {
                user_id: user.id,
                img_url: imageUrl,
                category: category,
                created_at: new Date().toISOString(),
            },
        ]);

        if (insertError) {
            console.error("Insert error:", insertError);
            alert("Error saving image data. Check RLS policies.");
            return;
        }
        setIsLoading(false);

        setFile(null);
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

            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="Hat">Hat</option>
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
                <option value="Shoes">Shoes</option>
            </select>
            <button className="upload-btn" onClick={handleUpload}>
                Upload
            </button>

            {/* ✅ Modal */}
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
