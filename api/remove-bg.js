import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
    try {
        const { imageUrl } = req.body;
        if (!imageUrl) return res.status(400).json({ error: "No image URL" });

        const output = await replicate.run(
            "cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            {
                input: {
                    image: imageUrl,
                    background: "white", // ✅ white background
                },
            }
        );

        // Return URL of processed image
        res.status(200).json({ url: output[0].url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to remove background" });
    }
}
