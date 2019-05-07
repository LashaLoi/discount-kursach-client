import jwt from "jsonwebtoken";
import { TOKEN_HEADER } from "../constants/apollo";

/**
 * Fallback `token` with stored in `localStorage` if it haven't been provided
 * @param {String} [token] JWT-compatible token to decode
 * @returns {String} Token
 */
const fallbackToken = token => {
    return token ? token : localStorage.getItem(TOKEN_HEADER);
};

/**
 * Reads all data included in `token`
 * @param {String} [token] JWT-compatible token to decode
 * @returns {Object} Decoded data
 */
export const tokenReader = token => jwt.decode(fallbackToken(token));

/**
 * Esures if `token` expired or not
 * @param {String} [token] JWT-compatible token to decode
 * @returns {Boolean} `true`, if token expired or does not exist, `false` if not
 */
export const isTokenExpired = token => {
    if (fallbackToken(token) === null) {
        return true;
    }
    const exp = jwt.decode(fallbackToken(token)).exp * 1000;
    const now = Date.now();
    return exp < now;
};

/**
 * Reads `ProfileId` included in `token`
 * @param {String} [token] JWT-compatible token to decode
 * @returns {Number} `ProfileId` included in `token`
 */
export const extractUserId = token => {
    if (fallbackToken(token) === null) {
        return null;
    }
    const decodedData = jwt.decode(fallbackToken(token));
    return decodedData ? decodedData.id.ProfileId : null;
};
