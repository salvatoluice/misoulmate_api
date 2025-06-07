// src/services/cloudinary.service.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const { environment } = require('../config');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Configure Cloudinary
cloudinary.config({
    cloud_name: environment.CLOUDINARY_CLOUD_NAME,
    api_key: environment.CLOUDINARY_API_KEY,
    api_secret: environment.CLOUDINARY_API_SECRET
});

const uploadImage = async (image, options = {}) => {
    try {
        const defaultOptions = {
            folder: 'misoulmate/profiles',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        };

        const uploadOptions = { ...defaultOptions, ...options };

        // Debug info
        console.log('Image type:', typeof image);
        if (typeof image === 'object') {
            console.log('Image keys:', Object.keys(image));
            if (image.path) console.log('Image path:', image.path);
            if (image.buffer) console.log('Has buffer:', !!image.buffer);
            if (image.originalname) console.log('Original name:', image.originalname);
        }

        // Handle Multer file object
        if (image && typeof image === 'object' && image.buffer) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(image.buffer);
            });
            return result;
        }

        // Handle base64 data URL
        if (typeof image === 'string' && image.startsWith('data:')) {
            return await cloudinary.uploader.upload(image, uploadOptions);
        }

        // Handle existing URLs (skip upload if already on Cloudinary)
        if (typeof image === 'string' && (image.startsWith('http://') || image.startsWith('https://'))) {
            if (image.includes('cloudinary.com')) {
                return { secure_url: image };
            }
            // Upload from external URL
            return await cloudinary.uploader.upload(image, uploadOptions);
        }

        // Handle file path
        if (typeof image === 'string' && fs.existsSync(image)) {
            return await cloudinary.uploader.upload(image, uploadOptions);
        }

        // Handle blob URL by skipping (this shouldn't happen if frontend is converting properly)
        if (typeof image === 'string' && image.startsWith('blob:')) {
            console.warn('Received blob URL - cannot process server-side:', image);
            throw new Error('Blob URLs cannot be processed server-side');
        }

        // If we get here, we don't know how to handle the image
        console.error('Unhandled image format:', image);
        throw new Error('Invalid image format');
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} images - Array of images
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of secure URLs
 */
const uploadMultipleImages = async (images, options = {}) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
        return [];
    }

    console.log('Uploading multiple images:', images.length);

    const uploadPromises = images.map(image => uploadImage(image, options));
    const results = await Promise.all(uploadPromises);

    return results.map(result => result.secure_url);
};

/**
 * Delete image from Cloudinary
 * @param {String} url - Cloudinary image URL
 * @returns {Promise<Object>} Deletion result
 */
const deleteImage = async (url) => {
    try {
        // Extract public ID from URL
        if (!url.includes('cloudinary.com')) {
            console.warn('Not a Cloudinary URL:', url);
            return { result: 'not_found' };
        }

        const urlParts = url.split('/');
        const filenameWithExt = urlParts[urlParts.length - 1];
        const filename = filenameWithExt.split('.')[0];

        // Extract folder path (everything after upload/)
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) {
            throw new Error('Invalid Cloudinary URL format');
        }

        const folderPath = urlParts.slice(uploadIndex + 1, -1).join('/');
        const publicId = folderPath ? `${folderPath}/${filename}` : filename;

        console.log('Deleting image with public ID:', publicId);

        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

/**
 * Validate if a string is a valid base64 image
 * @param {String} base64String - String to validate
 * @returns {Boolean} True if valid base64 image
 */
const isValidBase64Image = (base64String) => {
    if (typeof base64String !== 'string') return false;

    // Check for data:image prefix
    if (!base64String.startsWith('data:image/')) return false;

    // Check for base64 format
    const parts = base64String.split(',');
    if (parts.length !== 2) return false;

    // Check if valid base64
    try {
        const base64 = parts[1];
        atob(base64); // Attempt to decode
        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Upload base64 image string directly to Cloudinary
 * @param {String} base64String - Base64 encoded image string
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with secure_url
 */
const uploadBase64 = async (base64String, options = {}) => {
    if (!isValidBase64Image(base64String)) {
        console.error('Invalid base64 image format');
        throw new Error('Invalid base64 image format');
    }

    try {
        const defaultOptions = {
            folder: 'misoulmate/profiles',
            transformation: [{ width: 500, height: 500, crop: 'limit' }]
        };

        const uploadOptions = { ...defaultOptions, ...options };
        const result = await cloudinary.uploader.upload(base64String, uploadOptions);
        return result;
    } catch (error) {
        console.error('Cloudinary base64 upload error:', error);
        throw error;
    }
};

/**
 * Upload multiple base64 image strings to Cloudinary
 * @param {Array} base64Strings - Array of base64 image strings
 * @param {Object} options - Upload options
 * @returns {Promise<Array>} Array of secure URLs
 */
const uploadMultipleBase64 = async (base64Strings, options = {}) => {
    if (!base64Strings || !Array.isArray(base64Strings) || base64Strings.length === 0) {
        return [];
    }

    // Filter only valid base64 strings
    const validBase64Strings = base64Strings.filter(isValidBase64Image);

    if (validBase64Strings.length === 0) {
        console.warn('No valid base64 images to upload');
        return [];
    }

    console.log(`Uploading ${validBase64Strings.length} base64 images`);

    const uploadPromises = validBase64Strings.map(base64 => uploadBase64(base64, options));
    const results = await Promise.all(uploadPromises);

    return results.map(result => result.secure_url);
};

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'misoulmate/profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
    }
});

// Create multer uploader
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    cloudinary,
    upload,
    uploadImage,
    uploadMultipleImages,
    deleteImage,
    uploadBase64,
    uploadMultipleBase64,
    isValidBase64Image
};