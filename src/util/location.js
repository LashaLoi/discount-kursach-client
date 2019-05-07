import { CITIES } from "../constants/cities";

/**
 * Searches for closest city to user's location
 * @param {Number} lat Current latitude
 * @param {Number} lng Current longitude
 */
export const getClosestCity = (lat, lng) => {
    return CITIES
        .map(city => ({
            ...city,
            dLat: Math.abs(lat - city.lat),
            dLng: Math.abs(lng - city.lng),
        }))
        .reduce((acc, city) => {
            const r1 = Math.sqrt(acc.dLng**2 + acc.dLat**2);
            const r2 = Math.sqrt(city.dLng**2 + city.dLat**2);
            return r1 > r2 ? city : acc;
        }) || CITIES[0];
};

/**
 * Gets user's current location
 * @returns {Promise.<Position, Error>}
 */
export const getLocation = () => {
    const geolocation = navigator.geolocation;

    return new Promise((resolve, reject) => {
        if (!geolocation) {
            reject(new Error("Location service not supported"));
        }
        geolocation.getCurrentPosition(
            resolve,
            () => reject(new Error("Permission to user's location denied"))
        );
    });
};

export class LocationWatcher {
    constructor() {
        this.geolocation = navigator.geolocation;
        this.watchId = null;
        if (!this.geolocation) {
            throw new Error("Location service not supported");
        }
    }

    watchPosition = (successCallback, errorCallback) => {
        this.clearWatch();
        this.watchId = this.geolocation.watchPosition(
            successCallback,
            errorCallback
        );
    }

    clearWatch = () => {
        if (this.watchId !== null) {
            this.geolocation.clearWatch(this.watchId);
        }
    };
}
