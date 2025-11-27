import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../", "storage", "assignment");
    
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const filterFile = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"), false);
  }
  cb(null, true);
};

// Final Multer config
const upload = multer({
  storage,
  fileFilter: filterFile,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

export default upload;
