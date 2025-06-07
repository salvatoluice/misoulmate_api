const cloudinary = require('cloudinary').v2;
const { environment } = require('../config');

cloudinary.config({
    cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    api_key: environment.CLOUDINARY_API_KEY,
    api_secret: environment.CLOUDINARY_API_SECRET
});

const uploadImage = async (image, options = {}) => {
    try {
        const defaultOptions = {
            folder: 'misoulmate/profiles',
            transformation: [
                { width: 500, height: 500, crop: 'limit' }
            ]
        };

        const uploadOptions = { ...defaultOptions, ...options };

        if (typeof image === 'string' && image.startsWith('data:')) {
            return await cloudinary.uploader.upload(image, uploadOptions);
        } else if (Buffer.isBuffer(image) || (typeof image === 'object' && image.path)) {
            const uploadStream = cloudinary.uploader.upload_stream(uploadOptions);
            return new Promise((resolve, reject) => {
                uploadStream.on('finish', resolve);
                uploadStream.on('error', reject);

                if (Buffer.isBuffer(image)) {
                    uploadStream.write(image);
                    uploadStream.end();
                } else if (image.path) {
                    const fs = require('fs');
                    fs.createReadStream(image.path).pipe(uploadStream);
                }
            });
        } else if (typeof image === 'string' && (image.startsWith('http') || image.startsWith('https'))) {
            return { secure_url: image };
        }

        throw new Error('Invalid image format');
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

const uploadMultipleImages = async (images, options = {}) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return [];
    }

    const uploadPromises = images.map(image => uploadImage(image, options));
    const results = await Promise.all(uploadPromises);

    return results.map(result => result.secure_url);
};

const deleteImage = async (url) => {
    try {
        let publicId;
        if (url.startsWith('http')) {
            const urlParts = url.split('/');
            const filename = urlParts[urlParts.length - 1];
            const folderPath = urlParts.slice(urlParts.indexOf('misoulmate')).join('/');
            publicId = folderPath.substring(0, folderPath.lastIndexOf('.'));
        } else {
            publicId = url;
        }

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

module.exports = {
    uploadImage,
    uploadMultipleImages,
    deleteImage
};