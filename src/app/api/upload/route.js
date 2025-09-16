import { v2 as cloudinary } from "cloudinary";
import formidable from "formidable";
import fs from "fs";

cloudinary.config({ url: process.env.CLOUDINARY_URL });

export const config = {
  api: { bodyParser: false },
};

export async function POST(req) {
  try {
    const data = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const file = data.files.image.filepath;
    const result = await cloudinary.uploader.upload(file, { folder: "products" });

    return new Response(JSON.stringify({ url: result.secure_url }), { status: 200 });
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
  }
}
