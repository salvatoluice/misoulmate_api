const matchRepository = require('../repositories/match.repository');
const likeRepository = require('../repositories/like.repository');
const userRepository = require('../repositories/user.repository');
const profileRepository = require('../repositories/profile.repository');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

const createLike = async (likerId, likedId, status = 'like') => {
    if (likerId === likedId) {
        throw new BadRequestError('You cannot like yourself');
    }

    await userRepository.findById(likerId);
    await userRepository.findById(likedId);

    const existingLike = await likeRepository.findByUserIds(likerId, likedId);
    if (existingLike) {
        await existingLike.update({ status });
        return { like: existingLike, isMatch: false };
    }

    const like = await likeRepository.create({
        likerId,
        likedId,
        status
    });

    let match = null;
    let isMatch = false;

    if (status === 'like' || status === 'superlike') {
        const otherLike = await likeRepository.findByUserIds(likedId, likerId);

        if (otherLike && (otherLike.status === 'like' || otherLike.status === 'superlike')) {
            const existingMatch = await matchRepository.findByUserIds(likerId, likedId);

            if (!existingMatch) {
                const compatibilityScore = await calculateCompatibilityScore(likerId, likedId);

                match = await matchRepository.create({
                    user1Id: likerId,
                    user2Id: likedId,
                    status: 'active',
                    compatibilityScore
                });

                isMatch = true;
            } else {
                if (existingMatch.status === 'unmatched') {
                    match = await matchRepository.update(existingMatch.id, {
                        status: 'active',
                        unmatchedBy: null,
                        unmatchedReason: null
                    });

                    isMatch = true;
                } else {
                    match = existingMatch;
                }
            }
        }
    }

    return {
        like,
        match,
        isMatch
    };
};

const getUserLikes = async (userId, options = {}) => {
    return likeRepository.findByLikerId(userId, options);
};

const getUserLikedBy = async (userId, options = {}) => {
    return likeRepository.findByLikedId(userId, options);
};

const getUserMatches = async (userId, options = {}) => {
    const result = await matchRepository.findByUserId(userId, options);

    const matches = result.rows.map(match => {
        const otherUser = match.user1Id === userId ? match.user2 : match.user1;
        return {
            ...match.toJSON(),
            otherUser
        };
    });

    return {
        count: result.count,
        rows: matches
    };
};

const getMatchById = async (matchId, userId) => {
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this match');
    }

    const otherUser = match.user1Id === userId ? match.user2 : match.user1;

    return {
        ...match.toJSON(),
        otherUser
    };
};

const unmatchUsers = async (matchId, userId, reason = null) => {
    const match = await matchRepository.findById(matchId);

    if (match.user1Id !== userId && match.user2Id !== userId) {
        throw new ForbiddenError('You do not have access to this match');
    }

    return matchRepository.unmatch(matchId, userId, reason);
};

const calculateCompatibilityScore = async (user1Id, user2Id) => {
    try {
        const profile1 = await profileRepository.findByUserId(user1Id);
        const profile2 = await profileRepository.findByUserId(user2Id);

        let score = 0;
        let factors = 0;

        if (profile1.interests && profile2.interests) {
            const interests1 = new Set(profile1.interests);
            const interests2 = new Set(profile2.interests);

            const commonInterests = [...interests1].filter(x => interests2.has(x));

            const interestScore = Math.min(40, commonInterests.length * 10);
            score += interestScore;
            factors++;
        }

        if (profile1.ageRange && profile2.age) {
            const [minAge, maxAge] = profile1.ageRange;
            if (profile2.age >= minAge && profile2.age <= maxAge) {
                score += 20;
            }
            factors++;
        }

        if (profile2.ageRange && profile1.age) {
            const [minAge, maxAge] = profile2.ageRange;
            if (profile1.age >= minAge && profile1.age <= maxAge) {
                score += 20;
            }
            factors++;
        }

        if (profile1.lookingFor && profile2.lookingFor &&
            profile1.lookingFor === profile2.lookingFor) {
            score += 20;
            factors++;
        }

        return factors > 0 ? Math.min(100, Math.round(score / factors * 100)) : 50;
    } catch (error) {
        return 50;
    }
};

const getLikers = async (userId, options = {}) => {
    return likeRepository.getLikers(userId, options);
};

const getMatchStats = async (userId) => {
    const matchCount = await matchRepository.getMatchCount(userId);
    const recentMatches = await matchRepository.getRecentMatches(userId, 5);

    const likesGiven = await Like.count({
        where: {
            likerId: userId,
            status: 'like'
        }
    });

    const likesReceived = await Like.count({
        where: {
            likedId: userId,
            status: 'like'
        }
    });

    return {
        matchCount,
        likesGiven,
        likesReceived,
        recentMatches
    };
};

const getUserMatchesWithMessages = async (userId, options = {}) => {
    const matches = await getUserMatches(userId, options);

    const enrichedMatches = await messageService.enrichMatchesWithMessages(matches.rows, userId);

    return {
        count: matches.count,
        rows: enrichedMatches
    };
  };

module.exports = {
    createLike,
    getUserLikes,
    getUserLikedBy,
    getUserMatches,
    getMatchById,
    unmatchUsers,
    calculateCompatibilityScore,
    getLikers,
    getMatchStats,
    getUserMatchesWithMessages
};