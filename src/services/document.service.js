import { Document } from "../models/index.js";


class DocumentsService {
    async createDocument(data) {
        return await Document.create(data);
    }
    async getAllDocuments() {
        return await Document.find();
    }
    async getDocumentsByEmployeeId(id) {
        return await Document.find({ employee_id: id });
    }
    async deleteByDocumnentId(document_id) {
        return await Document.findByIdAndDelete({ _id: document_id })
    }

    async getByDocumnetId(document_id) {
        return await Document.findById({ _id: document_id })
    }
    async updateDocumnetsByEmployeeId(id) {
        return await Document.findByIdAndUpdate(
            id,
            data,
            { returnDocument: "after" }
        );
    }

}

export default new DocumentsService();