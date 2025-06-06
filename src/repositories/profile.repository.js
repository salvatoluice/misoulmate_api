const { Profile, ProfileQuestion } = require('../models');
const { NotFoundError } = require('../utils/errors');

const create = async (profileData) => {
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