import naturalCompare from "string-natural-compare";

import { SORT_TYPES, SORT_ORDERS } from "../constants/apollo";

/**
 * Returns benefit list from array of city's categories
 * @param {Object[]} categories Categories of given city
 * @returns {Object[]} Array of all city's benefits
 */
export const getBenefitsList = categories => (
    categories.reduce((acc, category) => [
        ...acc,
        ...category.benefits.map(b => ({
            ...b,
            categoryName: category.name,
            categoryId: category.id,
        })),
    ], [])
);

/**
 * Gets visible benefits either by `visible` field or benefit's id
 * @param {Object[]} benefits Array of benefits
 * @param {String} id Optional id of benefit to filter out all others
 * @returns {Object[]} Filtered array of benefits
 */
export const getVisibleBenefits = (benefits, id) => {
    if (!id) {
        return benefits.filter(benefit => benefit.visible);
    }
    return benefits.filter(benefit => benefit.id === id);
};

/**
 * Finds city that marked as `current`
 * @param {Object[]} cities Array of all cities
 * @returns {Object} Current city
 */
export const getCurrentCity = cities => cities.find(city => city.current);

naturalCompare.alphabet = "АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя";

/**
 * Sorts benefits by given key
 * @param {Object[]} benefits Array of benefits to sort
 * @param {string} key Key to sort by
 * @param {string} order Sort order (can be `asc` or `desc` for ascending and descending orders accordingly)
 * @returns {Object[]} __new__ benefits array, sorted
 */
export const sortBenefits = (benefits, key, asc) => {
    return [...benefits].sort((a, b) => {
        if (key === SORT_TYPES.name) {
            return asc === SORT_ORDERS.asc ? naturalCompare(a.name, b.name) : naturalCompare(b.name, a.name);
        }
        if (key === SORT_TYPES.createdAt) {
            return asc === SORT_ORDERS.asc
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : new Date(b.createdAt) - new Date(a.createdAt);
        }
        return asc === SORT_ORDERS.asc ? a[key] - b[key] : b[key] - a[key];
    });
};
