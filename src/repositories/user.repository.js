const { User } = require('../models');
const { NotFoundError } = require('../utils/errors');

const create = async (userData) => {
    return User.create(userData);
};

const findById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
    }
    return user;
};

const findByEmail = async (email) => {
    return User.findOne({ where: { email } });
};

const update = async (id, updateData) => {
    const user = await findById(id);
    return user.update(updateData);
};

const remove = async (id) => {
    const user = await findById(id);
    await user.destroy();
    return true;
};

const updateLastLogin = async (id) => {
    const user = await findById(id);
    return user.update({ lastLogin: new Date() });
};

module.exports = {
    create,
    findById,
    findByEmail,
    update,
    remove,
    updateLastLogin
};