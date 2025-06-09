const matchService = require('../../services/match.service');
const messageService = require('../../services/message.service');

const createLike = async (req, res, next) => {
    try {
        const { likedId, status } = req.body;
        const result = await matchService.createLike(req.user.id, likedId, status);

        res.status(201).json({
            like: result.like,
            isMatch: result.isMatch,
            match: result.match
        });
    } catch (error) {
        next(error);
    }
};

const getLikesGiven = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'like' } = req.query;
        const offset = (page - 1) * limit;

        const likes = await matchService.getUserLikes(req.user.id, { limit, offset, status });

        res.json({
            likes: likes.rows,
            pagination: {
                total: likes.count,
                page,
                limit,
                pages: Math.ceil(likes.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getLikesReceived = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'like' } = req.query;
        const offset = (page - 1) * limit;

        const likes = await matchService.getUserLikedBy(req.user.id, { limit, offset, status });

        res.json({
            likes: likes.rows,
            pagination: {
                total: likes.count,
                page,
                limit,
                pages: Math.ceil(likes.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getMatches = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'active' } = req.query;
        const offset = (page - 1) * limit;

        const matches = await matchService.getUserMatches(req.user.id, { limit, offset, status });

        res.json({
            matches: matches.rows,
            pagination: {
                total: matches.count,
                page,
                limit,
                pages: Math.ceil(matches.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

const getConversations = async (req, res, next) => {
    try {
        const conversations = await messageService.getConversationsByUserId(req.user.id);

        res.json({
            conversations
        });
    } catch (error) {
        next(error);
    }
};

const cleanUserForMatch = (user) => ({
    id: user.id,
    subscription: user.subscription,
    lastLogin: user.lastLogin,
    profile: {
        id: user.profile.id,
        name: user.profile.name,
        age: user.profile.age,
        gender: user.profile.gender,
        bio: user.profile.bio,
        location: user.profile.location,
        occupation: user.profile.occupation,
        education: user.profile.education,
        height: user.profile.height,
        photos: user.profile.photos,
        interests: user.profile.interests,
        languages: user.profile.languages,
        lookingFor: user.profile.lookingFor,
        drinking: user.profile.drinking,
        smoking: user.profile.smoking,
        zodiac: user.profile.zodiac,
        instagram: user.profile.instagram,
        spotifyArtists: user.profile.spotifyArtists,
        lastActive: user.profile.lastActive,
        questions: user.profile.questions || []
    }
});

const getMatchById = async (req, res, next) => {
    try {
        const match = await matchService.getMatchById(req.params.id, req.user.id);

        const response = {
            id: match.id,
            status: match.status,
            compatibilityScore: match.compatibilityScore,
            lastMessageAt: match.lastMessageAt,
            createdAt: match.createdAt,
            otherUser: cleanUserForMatch(match.otherUser)
        };

        res.json(response);
    } catch (error) {
        next(error);
    }
};

const unmatch = async (req, res, next) => {
    try {
        const { reason } = req.body;
        await matchService.unmatchUsers(req.params.id, req.user.id, reason);
        res.status(200).json({ message: 'Successfully unmatched' });
    } catch (error) {
        next(error);
    }
};

const getMatchStats = async (req, res, next) => {
    try {
        const stats = await matchService.getMatchStats(req.user.id);
        res.json(stats);
    } catch (error) {
        next(error);
    }
};

const getMatchesWithMessages = async (req, res, next) => {
    try {
        const { limit = 20, page = 1, status = 'active' } = req.query;
        const offset = (page - 1) * limit;

        const matches = await matchService.getUserMatchesWithMessages(req.user.id, { limit, offset, status });

        res.json({
            matches: matches.rows,
            pagination: {
                total: matches.count,
                page,
                limit,
                pages: Math.ceil(matches.count / limit)
            }
        });
    } catch (error) {
        next(error);
    }
  };

module.exports = {
    createLike,
    getLikesGiven,
    getLikesReceived,
    getMatches,
    getMatchById,
    unmatch,
    getMatchStats,
    getMatchesWithMessages,
    getConversations
};