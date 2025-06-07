const Joi = require('joi');

const createSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(18),
    bio: Joi.string(),
    location: Joi.string(),
    occupation: Joi.string(),
    education: Joi.string(),
    height: Joi.string(),
    photos: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    lookingFor: Joi.string(),
    showMe: Joi.string(),
    ageRange: Joi.array().items(Joi.number().integer()).length(2),
    maxDistance: Joi.number().integer().positive(),
    drinking: Joi.string(),
    smoking: Joi.string(),
    zodiac: Joi.string(),
    instagram: Joi.string(),
    spotifyArtists: Joi.array().items(Joi.string()),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().required(),
            answer: Joi.string().required()
        })
    )
});

const updateSchema = Joi.object({
    name: Joi.string(),
    age: Joi.number().integer().min(18),
    bio: Joi.string(),
    location: Joi.string(),
    occupation: Joi.string(),
    education: Joi.string(),
    height: Joi.string(),
    photos: Joi.array().items(Joi.string()),
    interests: Joi.array().items(Joi.string()),
    languages: Joi.array().items(Joi.string()),
    lookingFor: Joi.string(),
    showMe: Joi.string(),
    ageRange: Joi.array().items(Joi.number().integer()).length(2),
    maxDistance: Joi.number().integer().positive(),
    drinking: Joi.string(),
    smoking: Joi.string(),
    zodiac: Joi.string(),
    instagram: Joi.string(),
    spotifyArtists: Joi.array().items(Joi.string()),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().required(),
            answer: Joi.string().required()
        })
    )
}).min(1);

/**
 * Profile ID param schema
 */
const idParamSchema = Joi.object({
    id: Joi.string().uuid().required()
});

const updatePhotosSchema = Joi.object({
    photos: Joi.array().items(Joi.string()).required().min(1)
});

const updateInterestsSchema = Joi.object({
    interests: Joi.array().items(Joi.string()).required().min(1)
});

const deletePhotoSchema = Joi.object({
    photoUrl: Joi.string().uri().required()
});

module.exports = {
    createSchema,
    updateSchema,
    idParamSchema,
    updatePhotosSchema,
    updateInterestsSchema,
    deletePhotoSchema
};