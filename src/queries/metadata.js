import gql from "graphql-tag";

export const LOGIN = gql`
    mutation($login: String!, $password: String!) {
        login(login: $login, password: $password) {
            token
            refreshToken
            errorCode
            errorMessage
        }
    }
`;

export const LOGOUT = gql`
    mutation logout {
        logout @client
    }
`;

export const GET_LOGIN_STATUS = gql`
    {
        metadata {
            isLoggedIn
            authErrorCode
            authErrorMessage
        }
    }
`;

export const SET_LOCATION = gql`
    mutation setLocation($lat: Float, $lng: Float, $isAllowed: Boolean!) {
        setLocation(lat: $lat, lng: $lng, isAllowed: $isAllowed) @client
    }
`;

export const GET_TIMESTAMP = gql`
    {
        metadata {
            timestamp
        }
    }
`;

export const GET_ERROR_CODE = gql`
    {
        metadata {
            appErrorCode
        }
    }
`;

export const GET_LOCATION = gql`
    {
        metadata {
            lat,
            lng,
            isLocationAllowed
        }
    }
`;
