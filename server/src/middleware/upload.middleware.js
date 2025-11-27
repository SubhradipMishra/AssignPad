import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid"; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../", "storage", "assignment");
    cb(null, dest);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); 
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});


const filterFile = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: filterFile,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});


export const uploadSingle = upload.single("assignment");
export const uploadMultiple = upload.array("assignments", 10);

export default upload;
