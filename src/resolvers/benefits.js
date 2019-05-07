import Logger from "../util/logger";
import { GET_BENEFIT_TO_HOVER, GET_BENEFIT_TO_RATE, GET_LOCATION_TO_HOVER } from "../queries/benefits";
import { GET_USER_FAVORITES } from "../queries/user";
import { extractUserId } from "../util/tokenParser";

export const benefitsMutationResolvers = {
    hoverBenefit: (__, { id, hoverState = false }, { cache }) => {
        try {
            const benefit = cache.readFragment({ fragment: GET_BENEFIT_TO_HOVER, id });
            if (benefit.hovered !== hoverState) {
                const data = { ...benefit, hovered: hoverState };
                cache.writeData({ data, id });
            }
            return null;
        } catch(error) {
            Logger.error(error);
            return null;
        }
    },
    hoverLocation: (__, { id, hoverState = false }, { cache }) => {
        try {
            const location = cache.readFragment({ fragment: GET_LOCATION_TO_HOVER, id });
            if (location.hovered !== hoverState) {
                const data = { ...location, hovered: hoverState };
                cache.writeData({ data, id });
            }
        } catch(error) {
            Logger.error(error);
        } finally {
            return null;
        }
    },
    rateBenefit: (__, { id, stars }, { cache }) => {
        try {
            const benefit = cache.readFragment({ fragment: GET_BENEFIT_TO_RATE, id });
            const data = { ...benefit, localRating: stars };
            cache.writeData({ data, id });
            return null;
        } catch(error) {
            Logger.error(error);
            return null;
        }
    },
};

export const updateAfterLike = id => (proxy, { data: { toggleFavorite } }) => {
    try {
        if (!toggleFavorite) {
            throw new Error("Response error: toggleFavorite received with `false`");
        }
        const profileId = extractUserId();
        const { getUser } = proxy.readQuery({ query: GET_USER_FAVORITES, variables: { profileId } });
        proxy.writeQuery({
            query: GET_USER_FAVORITES,
            variables: { profileId },
            data: {
                getUser: {
                    ...getUser,
                    favorites: getUser.favorites.includes(id)
                        ? getUser.favorites.filter(e => e !== id)
                        : [...getUser.favorites, id],
                },
            },
        });
    } catch(error) {
        Logger.error(error);
    } finally {
        return null;
    }
};
