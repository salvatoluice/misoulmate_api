const { Profile, ProfileQuestion } = require('../models');
const { NotFoundError } = require('../utils/errors');
const cloudinaryService = require('../services/cloudinary.service');

const create = async (profileData) => {
    if (profileData.photos && Array.isArray(profileData.photos) && profileData.photos.length > 0) {
        const folderPath = `misoulmate/profiles/${profileData.userId}`;
        const photoUrls = await cloudinaryService.uploadMultipleBase64(profileData.photos, {
            folder: folderPath
        });

        profileData.photos = photoUrls;
      }

    const profile = await Profile.create(profileData);

    if (profileData.questions && profileData.questions.length > 0) {
        const questions = profileData.questions.map(q => ({
            ...q,
            profileId: profile.id
        }));

        await ProfileQuestion.bulkCreate(questions);
    }

    return findById(profile.id);
  };

const findById = async (id) => {
    const profile = await Profile.findByPk(id, {
        include: [
            {
                model: ProfileQuestion,
                as: 'questions'
            }
        ]
    });

    if (!profile) {
        throw new NotFoundError(`Profile with ID ${id} not found`);
    }

    return profile;
};

const findByUserId = async (userId) => {
    const profile = await Profile.findOne({
        where: { userId },
        include: [
            {
                model: ProfileQuestion,
                as: 'questions'
            }
        ]
    });

    if (!profile) {
        throw new NotFoundError(`Profile for user ID ${userId} not found`);
    }

    return profile;
};

const update = async (id, updateData) => {
    const profile = await findById(id);

    if (updateData.photos && Array.isArray(updateData.photos) && updateData.photos.length > 0) {
        const existingUrls = updateData.photos.filter(photo =>
            typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('https'))
        );

        const newPhotos = updateData.photos.filter(photo =>
            !(typeof photo === 'string' && (photo.startsWith('http') || photo.startsWith('https')))
        );

        if (newPhotos.length > 0) {
            const folderPath = `misoulmate/profiles/${profile.userId}`;
            const newPhotoUrls = await cloudinaryService.uploadMultipleImages(newPhotos, {
                folder: folderPath
            });

            updateData.photos = [...existingUrls, ...newPhotoUrls];
        }
    }

    const { questions, ...profileData } = updateData;

    await profile.update(profileData);

    if (questions && questions.length > 0) {
        await ProfileQuestion.destroy({
            where: { profileId: id }
        });

        const questionsData = questions.map(q => ({
            ...q,
            profileId: id
        }));

        await ProfileQuestion.bulkCreate(questionsData);
    }

    return findById(id);
  };

const remove = async (id) => {
    const profile = await findById(id);
    await profile.destroy();
    return true;
};

const updateLastActive = async (id) => {
    const profile = await findById(id);
    return profile.update({ lastActive: new Date() });
};

module.exports = {
    create,
    findById,
    findByUserId,
    update,
    remove,
    updateLastActive
};