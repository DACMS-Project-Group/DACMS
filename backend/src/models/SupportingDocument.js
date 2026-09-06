import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENT_DIRECTORY = path.resolve(__dirname, "..", "documents");

class SupportingDocument {
    constructor({
        document_id = null,
        student_id = null,
        name,
        type,
        file_path = null,
        file = null,
        upload_timestamp = new Date()
    }) {
        this.document_id = document_id;
        this.student_id = student_id;
        this.name = name;
        this.type = type;
        this.file_path = file_path;
        this.file = file;
        this.upload_timestamp = upload_timestamp;
    }

    static fromDb(row) {
        return new SupportingDocument({
            document_id: row.DocumentID ?? row.document_id,
            student_id: row.StudentID ?? row.student_id,
            type: row.DocumentType ?? row.document_type,
            file_path: row.FilePath ?? row.file_path,
            upload_timestamp: row.UploadTimestamp ?? row.upload_timestamp
        });
    }

    toDb() {
        return {
            DocumentID: this.document_id,
            StudentID: this.student_id,
            DocumentType: this.type,
            FilePath: this.file_path,
            UploadTimestamp: this.upload_timestamp
        };
    }

    async saveFile() {
        this.validate();

        if (!this.file?.buffer) {
            throw new Error("A valid uploaded file is required.");
        }

        const extension = path.extname(this.file.originalname || "");
        const fileName = `${this.student_id}-${randomUUID()}${extension}`;
        const destinationPath = path.join(DOCUMENT_DIRECTORY, fileName);

        await fs.mkdir(DOCUMENT_DIRECTORY, { recursive: true });
        await fs.writeFile(destinationPath, this.file.buffer, { flag: "wx" });

        // Store only the safe filename in the database.
        this.file_path = fileName;

        return true;
    }

    async getFile() {
        if (!this.file_path?.trim()) {
            throw new Error("File path is required.");
        }

        const fileName = path.basename(this.file_path);
        const filePath = path.join(DOCUMENT_DIRECTORY, fileName);

        return fs.readFile(filePath);
    }

    validate() {
        if (this.document_id === null || this.document_id === undefined || this.document_id === "") {
            throw new Error("Document ID is required.");
        }

        if (this.student_id === null || this.student_id === undefined || this.student_id === "") {
            throw new Error("Student ID is required.");
        }

        if (!this.name?.trim()) {
            throw new Error("Document name is required.");
        }

        if (!this.type?.trim()) {
            throw new Error("Document type is required.");
        }
    }
}

export default SupportingDocument;