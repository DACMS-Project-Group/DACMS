import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// backend/src/middlewares/upload.js -> backend/documents
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCUMENTS_DIR = path.join(__dirname, '..', '..', 'documents');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DOCUMENTS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        cb(null, `${uniqueSuffix}${ext}`);
    },
});

const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
];

function fileFilter(req, file, cb) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(new Error('Unsupported file type. Only PDF, JPEG, and PNG are allowed.'));
    }
    cb(null, true);
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

export default upload;
