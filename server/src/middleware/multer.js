import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "promptverse_thumbs",
    allowed_formats: ["jpg", "jpeg", "png"],
    secure: true, // Ensure HTTPS URLs
  },
});

const upload = multer({ storage });

export { upload };
