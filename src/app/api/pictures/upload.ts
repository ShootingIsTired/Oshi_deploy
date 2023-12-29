import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from 'cloudinary'

cloudinary.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const image = req.body.image; // Assuming `image` is a single string of the image data

    try {
        const result = await cloudinary.v2.uploader.upload(image, {
            folder: "oshi"
        });
        console.log(result);
        // Since it's just one image, you can return the single link directly
        res.status(200).json({ message: "success", link: result.secure_url });
    } catch (error) {
        const typedError = error as Error;
        console.error(typedError);
        res.status(500).json({ message: "error", error: typedError.message });
    }
}