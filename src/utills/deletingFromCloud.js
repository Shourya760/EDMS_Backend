export const getPublicIdFromUrl = (url) => {
    try {
        // Get everything after '/upload/'
        let publicId = url.split("/upload/")[1];

        // Remove version (e.g. v1754465345/)
        publicId = publicId.replace(/^v\d+\//, "");

        // Remove file extension (.pdf, .jpg, .png, etc.)
        publicId = publicId.replace(/\.[^/.]+$/, "");

        return publicId;
    } catch (error) {
        throw new Error("Invalid Cloudinary URL");
    }
};