import { APOLLO_TYPES, TOKEN_HEADER, REFRESH_TOKEN_HEADER } from "../constants/apollo";

import { resetCache } from "../apollo.config";
import Logger from "../util/logger";
import { isTokenExpired } from "../util/tokenParser";

import { GET_LOCATION, GET_LOGIN_STATUS } from "../queries/metadata";

export const metadataMutationResolvers = {
    setLocation: (__, { lat = null, lng = null, isAllowed }, { cache, getCacheKey }) => {
        try {
            const data = {
                metadata: {
                    __typename: APOLLO_TYPES.Metadata,
                    lat,
                    lng,
                    isLocationAllowed: isAllowed,
                },
            };
            cache.writeQuery({ data, query: GET_LOCATION });
        } catch (e) {
            Logger.error(e);
        } finally {
            return null;
        }
    },
    logout: (__, variables, { cache }) => {
        const { metadata } = cache.readQuery({ query: GET_LOGIN_STATUS });
        resetCache().then(() => {
            cache.writeQuery({
                query: GET_LOGIN_STATUS, data: {
                    metadata: {
                        ...metadata,
                        isLoggedIn: false,
                    },
                },
            });
        }).catch(Logger.error);
        return null;
    },
};

export const updateAfterLogin = (proxy, { data: { login, error: responseError } }) => {
    try {
        if (responseError) {
            throw new Error(responseError);
        }
        const { token, refreshToken } = login;
        const { metadata } = proxy.readQuery({ query: GET_LOGIN_STATUS });
        if (token && refreshToken) {
            localStorage.setItem(TOKEN_HEADER, token);
            localStorage.setItem(REFRESH_TOKEN_HEADER, refreshToken);
            proxy.writeQuery({
                query: GET_LOGIN_STATUS, data: {
                    metadata: {
                        ...metadata,
                        authErrorCode: login.errorCode,
                        authErrorMessage: login.errorMessage,
                        isLoggedIn: true,
                    },
                },
            });
        } else {
            proxy.writeQuery({
                query: GET_LOGIN_STATUS, data: {
                    metadata: {
                        ...metadata,
                        authErrorCode: login.errorCode,
                        authErrorMessage: login.errorMessage,
                    },
                },
            });
        }
    } catch (error) {
        Logger.error(error);
    }
};

export const metadataDefaults = {
    __typename: APOLLO_TYPES.Metadata,
    timestamp: Date.now(),
    appErrorCode: null,
    authErrorCode: null,
    authErrorMessage: "",
    lat: null,
    lng: null,
    isLocationAllowed: false,
    isLoggedIn: !isTokenExpired(),
};
