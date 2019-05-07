import client, { persistor } from "./apollo.config";
import { APOLLO_TYPES, TOKEN_HEADER } from "./constants/apollo";
import Logger from "./util/logger";

import { GET_TIMESTAMP, GET_ERROR_CODE, GET_LOGIN_STATUS } from "./queries/metadata";

export default async () => {
    try {
        Logger.debug("Cleaning persisted data...");
        const now = Date.now();
        const { metadata: { timestamp } } = client.cache.readQuery({ query: GET_TIMESTAMP });
        Logger.debug(`Timestamps diff is ${now - timestamp}`);
        if (now - timestamp > (1000 * 60 * 60 * 2)) {
            await client.resetStore();
            return persistor.purge();
        } else {
            client.cache.writeQuery({
                query: GET_ERROR_CODE, data: {
                    metadata: {
                        appErrorCode: null,
                        __typename: APOLLO_TYPES.Metadata,
                    },
                },
            });

            client.cache.writeQuery({
                query: GET_LOGIN_STATUS, data: {
                    metadata: {
                        isLoggedIn: !!localStorage.getItem(TOKEN_HEADER),
                        authErrorCode: null,
                        authErrorMessage: "",
                        __typename: APOLLO_TYPES.Metadata,
                    },
                },
            });

            Logger.debug("Persisted data cleaned");
            return persistor.persist();
        }
    } catch (error) {
        Logger.error(error);
        return Promise.resolve();
    }
};
