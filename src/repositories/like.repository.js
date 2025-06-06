const { Like, User, Profile } = require('../models');
const { NotFoundError } = require('../utils/errors');
const { Op } = require('sequelize');

const create = async (likeData) => {
    return Like.create(likeData);
};

const findById = async (id) => {
    const like = await Like.findByPk(id);
    if (!like) {
        throw new NotFoundError(`Like with ID ${id} not found`);
    }
    return like;
};

const findByUserIds = async (likerId, likedId) => {
    return Like.findOne({
        where: {
            likerId,
            likedId
        }
    });
};

const findByLikerId = async (likerId, options = {}) => {
    const { limit = 20, offset = 0, status = 'like' } = options;

    return Like.findAndCountAll({
        where: {
            likerId,
            status
        },
        include: [
            {
                model: User,
                as: 'liked',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const findByLikedId = async (likedId, options = {}) => {
    const { limit = 20, offset = 0, status = 'like' } = options;

    return Like.findAndCountAll({
        where: {
            likedId,
            status
        },
        include: [
            {
                model: User,
                as: 'liker',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

const update = async (id, updateData) => {
    const like = await findById(id);
    return like.update(updateData);
};

const remove = async (id) => {
    const like = await findById(id);
    await like.destroy();
    return true;
};

const checkMutualLike = async (user1Id, user2Id) => {
    const count = await Like.count({
        where: {
            [Op.or]: [
                {
                    likerId: user1Id,
                    likedId: user2Id,
                    status: 'like'
                },
                {
                    likerId: user2Id,
                    likedId: user1Id,
                    status: 'like'
                }
            ]
        }
    });

    return count === 2;
};

const getLikers = async (userId, options = {}) => {
    const { limit = 20, offset = 0 } = options;

    return Like.findAndCountAll({
        where: {
            likedId: userId,
            status: 'like'
        },
        include: [
            {
                model: User,
                as: 'liker',
                include: [
                    {
                        model: Profile,
                        as: 'profile'
                    }
                ]
            }
        ],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
    });
};

module.exports = {
    create,
    findById,
    findByUserIds,
    findByLikerId,
    findByLikedId,
    update,
    remove,
    checkMutualLike,
    getLikers
};