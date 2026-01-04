import type { Request, Response } from "express";
import path from "path";
import { ENV } from "../config/env";

// Handle single image upload and return public URL
export const uploadImage = async (req: Request, res: Response) => {
  try {
    // multer attaches file to req.file
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Build a URL that the frontend can use to fetch the uploaded image.
    // Prefer a configured BASE_URL when provided (recommended behind proxies),
    // otherwise fall back to deriving from the incoming request.
    let publicUrl: string;
    if (ENV.BASE_URL) {
      // trim trailing slash if present
      const base = ENV.BASE_URL.replace(/\/+$/, "");
      publicUrl = `${base}/uploads/${file.filename}`;
    } else {
      const host = req.get("host");
      const protocol = req.protocol;
      publicUrl = `${protocol}://${host}/uploads/${file.filename}`;
    }

    res.status(201).json({ imageUrl: publicUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
