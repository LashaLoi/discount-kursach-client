import { benefitsMutationResolvers } from "./benefits";
import { filtersMutationResolvers, filtersDefaults } from "./filters";
import { cityMutationResolvers } from "./city";
import { userMutationResolvers } from "./user";
import { metadataMutationResolvers, metadataDefaults } from "./metadata";

import { findCityByName, CITIES } from "../constants/cities";
import { APOLLO_TYPES } from "../constants/apollo";
import { getDiscountRange, getHighestDiscount } from "../util/discount-parser";
import { extractUserId } from "../util/tokenParser";

export const resolvers = {
    Mutation: {
        ...benefitsMutationResolvers,
        ...filtersMutationResolvers,
        ...cityMutationResolvers,
        ...userMutationResolvers,
        ...metadataMutationResolvers,
    },
    Benefit: {
        visible: () => true,
        hovered: () => false,
        discountRange: obj => {
            if (obj.discount && obj.discount.length) {
                return getDiscountRange(obj.discount);
            }
            return null;
        },
        highestDiscount: obj => getHighestDiscount(obj.discount),
        userRating: obj => {
            const userId = `${extractUserId()}`;
            if (obj.comments) {
                const userComment = obj.comments.find(comment => comment.userId === userId);
                return userComment ? userComment.rating : 0;
            }
            return 0;
        },
    },
    Location: {
        hovered: () => false,
    },
    City: {
        zoom: obj => findCityByName(obj.name).zoom,
        lat: obj => findCityByName(obj.name).lat,
        lng: obj => findCityByName(obj.name).lng,
        current: obj => obj.name === CITIES[0].name,
        alias: obj => obj.alias || obj.id,
    },
};

export const defaults = {
    __typename: APOLLO_TYPES.LocalState,
    filters: filtersDefaults,
    metadata: metadataDefaults,
};
