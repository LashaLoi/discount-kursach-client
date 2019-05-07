import Logger from "../util/logger";

import { GET_ALL_CITIES } from "../queries/city";

export const cityMutationResolvers = {
    updateCurrentCity: (__, { id, name }, { cache }) => {
        try {
            if (!id && !name) {
                throw new Error("City cannot be changed: name or id haven't been provided");
            }
            const { getCities } = cache.readQuery({ query: GET_ALL_CITIES });
            const updatedCities = getCities.map(city => ({
                ...city,
                current: id ? city.id === id : city.name === name,
            }));
            cache.writeData({ data: { getCities: updatedCities } });
            return null;
        } catch (error) {
            Logger.error(error);
            return null;
        }
    },
};
