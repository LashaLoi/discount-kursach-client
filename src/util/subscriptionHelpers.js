import xor from "lodash/xor";

import { COMMENT_SET, COMMENT_DELETED, VOTE_SET, RATING_SET } from "../queries/benefits";
import { FAVORITE_TOGGLE } from "../queries/user";
import { extractUserId } from "./tokenParser";

export const subscribeToNewComments = (subscribeToMore, variables) => {
    return subscribeToMore({
        document: COMMENT_SET,
        variables,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
                return prev;
            }
            const userId = `${extractUserId()}`;
            const newComment = subscriptionData.data.commentSet;
            const filteredComments = prev.getBenefit.comments.filter(comment => comment.userId !== userId);
            return {
                getBenefit: {
                    ...prev.getBenefit,
                    comments: [newComment, ...filteredComments],
                    userRating: newComment.userId === userId ? newComment.rating : prev.getBenefit.userRating,
                },
            };
        },
    });
};

export const subscribeToDeleteComments = (subscribeToMore, variables) => {
    return subscribeToMore({
        document: COMMENT_DELETED,
        variables,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
                return prev;
            }
            const userId = `${extractUserId()}`;
            const deletedComment = subscriptionData.data.commentDeleted;
            return {
                getBenefit: {
                    ...prev.getBenefit,
                    comments: prev.getBenefit.comments.filter(comment => comment.id !== deletedComment.id),
                    userRating: deletedComment.userId === userId ? 0 : prev.getBenefit.userRating,
                },
            };
        },
    });
};

export const subscribeToFavoriteToggle = (subscribeToMore, callback) => {
    return subscribeToMore({
        document: FAVORITE_TOGGLE,
        variables: { userId: `${extractUserId()}` },
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
                return prev;
            }
            // console.log(prev, subscriptionData);
            const prevFavorites = prev.getUser.favorites;
            const nextFavorites = subscriptionData.data.favoriteToggle.favorites;
            const diff = xor(prevFavorites, nextFavorites)[0];
            if (callback) {
                callback(nextFavorites.includes(diff));
            }
            return {
                getUser: {
                    ...prev.getUser,
                    favorites: nextFavorites,
                },
            };
        },
    });
};

export const subscribeToVoteSet = (subscribeToMore, variables) => {
    return subscribeToMore({
        document: VOTE_SET,
        variables,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
                return prev;
            }
            const data = {
                getBenefit: {
                    ...prev.getBenefit,
                    comments: prev.getBenefit.comments.map(comment => {
                        if (comment.id === subscriptionData.data.voteSet.commentId) {
                            return {
                                ...comment,
                                votes: comment.votes.find(vote => vote.id === subscriptionData.data.voteSet.id)
                                    ? comment.votes.filter(vote => vote.id !== subscriptionData.data.voteSet.id)
                                    : [...comment.votes, subscriptionData.data.voteSet],
                            };
                        }
                        return comment;
                    }),
                },
            };
            return data;
        },
    });
};

export const subscribeToRatingSet = (subscribeToMore, variables) => {
    return subscribeToMore({
        document: RATING_SET,
        variables,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData) {
                return prev;
            }
            const rating = subscriptionData.data.ratingSet;
            return {
                getBenefit: {
                    ...prev.getBenefit,
                    rating,
                },
            };
        },
    });
};
