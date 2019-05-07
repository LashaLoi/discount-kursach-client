import gql from "graphql-tag";

// export const GET_USER = gql`
//     query ($profileId: Int!) {
//         getUser(profileId: $profileId) {
//             FirstName
//             FirstNameEng
//             Image
//             LastName
//             LastNameEng
//             ProfileId
//             EmploymentDate
//             favorites
//         }
//     }
// `;

export const GET_BASIC_USER_DATA = gql`
    query ($profileId: Int!) {
        getUser(profileId: $profileId) {
            firstName
            lastName
            profileId
            favorites
            image
        }
    }
`;

export const GET_USER_FAVORITES = gql`
    query ($profileId: Int!) {
        getUser(profileId: $profileId) {
            profileId
            favorites
        }
    }
`;

export const GET_USER_VOTES = gql`
    query ($profileId: Int!) {
        getUser(profileId: $profileId) {
            profileId
            votes {
                id
                commentId
            }
        }
    }
`;

export const FAVORITE_TOGGLE = gql`
    subscription favoriteToggle($userId: String!) {
        favoriteToggle(userId: $userId) {
            profileId
            favorites
        }
    }
`;
