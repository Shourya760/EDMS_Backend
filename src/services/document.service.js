import { Document } from "../models/index.js";


class DocumentsService {
    async createDocument(data) {
        return await Document.create(data);
    }
    async getDocumentsByEmployeeId(id) {
        return await Document.find({ employee_id: id });
    }
}

export default new DocumentsService();