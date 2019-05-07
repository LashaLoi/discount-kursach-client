import unfetch from "unfetch";
import { ApolloClient } from "apollo-client";

import { ApolloLink/*, split*/ } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { withClientState } from "apollo-link-state";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
// import { WebSocketLink } from "apollo-link-ws";

import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";

// import { getMainDefinition } from "apollo-utilities";

import { resolvers, defaults } from "./resolvers";
import { GET_ERROR_CODE } from "./queries/metadata";
import { TOKEN_HEADER, REFRESH_TOKEN_HEADER, APOLLO_TYPES, ERROR_EXTENSION_CODES } from "./constants/apollo";
import Logger from "./util/logger";

const cache = new InMemoryCache({
    dataIdFromObject: object => {
        switch (object.__typename) {
            case APOLLO_TYPES.Login: return object.profileId;
            default: return object.id;
        }
    },
});

const persistor = new CachePersistor({
    cache,
    storage: window.localStorage,
    debug: process.env.NODE_ENV === "development",
});

const stateLink = withClientState({ resolvers, cache, defaults });

export const resetCache = async (emergency = false) => {
    emergency ? Logger.warn("Emergency state reset...") : Logger.debug("State reset...");
    await cache.reset();
    stateLink.writeDefaults();
    localStorage.removeItem(TOKEN_HEADER);
    localStorage.removeItem(REFRESH_TOKEN_HEADER);
};

const afterwareLink = new ApolloLink((operation, forward) => {
    return forward(operation).map(response => {
        const context = operation.getContext();
        if (context.response) {
            const { response: { headers } } = context;

            if (headers) {
                const token = headers.get(TOKEN_HEADER);
                const refreshToken = headers.get(REFRESH_TOKEN_HEADER);

                if (token && refreshToken) {
                    localStorage.setItem(TOKEN_HEADER, token);
                    localStorage.setItem(REFRESH_TOKEN_HEADER, refreshToken);
                    Logger.debug("Tokens successfully updated");
                }
            }
        }

        return response;
    });
});

const authLink = setContext((req, prevContext) => {
    const token = localStorage.getItem(TOKEN_HEADER);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_HEADER);
    return {
        ...prevContext.headers,
        headers: {
            [TOKEN_HEADER]: token || "",
            [REFRESH_TOKEN_HEADER]: refreshToken || "",
        },
    };
});

// eslint-disable-next-line consistent-return
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            Logger.error("[GraphQL error]", err);
            switch (err.extensions.code) {
                case ERROR_EXTENSION_CODES.BENEFIT_NOT_FOUND: {
                    Logger.warn("No such benefit, redirect needed");
                    break;
                }
                default: {
                    resetCache(true);
                    break;
                }
            }
            cache.writeQuery({
                query: GET_ERROR_CODE, data: {
                    metadata: {
                        appErrorCode: err.extensions.code,
                        __typename: APOLLO_TYPES.Metadata,
                    },
                },
            });
        }
    }
    if (networkError) {
        Logger.error("[Network error]:", networkError);
    }
});

const httpLink = new HttpLink({
    uri: process.env.REACT_APP_BACKEND_URI,
    fetch: unfetch,
});

// const wsLink = new WebSocketLink({
//     uri: process.env.REACT_APP_BACKEND_URI_WS,
//     options: {
//         reconnect: true,
//     },
// });

// const webLink = split(
//     ({ query }) => {
//         const { kind, operation } = getMainDefinition(query);
//         return kind === "OperationDefinition" && operation === "subscription";
//     },
//     wsLink,
//     httpLink,
// );

const webLink = httpLink;

const client = new ApolloClient({
    link: ApolloLink.from([
        stateLink,
        afterwareLink,
        authLink,
        errorLink,
        webLink,
    ]),
    cache,
});

client.onResetStore(stateLink.writeDefaults);

export default client;

export {
    persistor,
    client,
};
