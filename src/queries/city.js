import gql from "graphql-tag";

export const GET_ALL_CITIES = gql`
    query {
        getCities {
            name
            id
            lat @client
            lng @client
            zoom @client
            current @client
            __typename
        }
    }
`;

export const GET_CURRENT_CITY = gql`
    query {
        currentCity @client {
            __typename
            id
            name
            zoom
            lat
            lng
        }
    }
`;

export const GET_CURRENT_CITY_ID = gql`
    query {
        currentCity @client {
            __typename
            id
        }
    }
`;

export const UPDATE_CURRENT_CITY = gql`
    mutation updateCurrentCity($id: String, $name: String) {
        updateCurrentCity(id: $id, name: $name) @client
    }
`;

export const INIT_CURRENT_CITY = gql`
    mutation initCurrentCity($name: String!) {
        initCurrentCity(name: $name) @client
    }
`;
