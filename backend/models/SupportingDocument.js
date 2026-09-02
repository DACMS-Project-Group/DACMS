class SupportingDocument {
    constructor({
        document_id = null,
        student_id = null,
        name,
        type,
        file_path,
        file,
        upload_timestamp = new Date()
    }) {
        this.document_id = document_id,
        this.student_id = student_id,
        this.name = name,
        this.type = type,
        this.file_path = file_path,
        this.file,
        this.upload_timestamp = upload_timestamp
    }

    static fromDb(row) {
        return new SupportingDocument({
            document_id: row.document_id,
            student_id: row.student_id,
            type: row.type,
            file_path: row.file_path,
            upload_timestamp: row.upload_timestamp
        })
    }

    static toDb() {
        return{
            DocumentID: this.document_id,
            StudentID: this.student_id,
            DocumentName: this.name,
            DocumentType: this.type,
            FilePath: this.file_path,
            UploadTimestamp: this.upload_timestamp
        }
    }

    // Saves the file to the document directory
    // Returns success boolean
    saveFile(){
        return true;
    }

    // Retrieves the file from the document directory
    // Returns success boolean
    getFile(){
        return true;
    }

    validate() {
        if (this.document_id === null || this.document_id === undefined || this.document_id === "") {
            throw new Error("Role ID is required.");
        }
        if (this.student_id === null || this.student_id === undefined || this.student_id === "") {
            throw new Error("Role ID is required.");
        }
        if (!this.name?.trim()) {
            throw new Error("Document name is required");
        }
    }
}