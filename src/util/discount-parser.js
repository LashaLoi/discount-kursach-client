import uniq from "lodash/uniq";

/**
 * Parses sale discount and gets highest
 * @param {Array<String>} discount Sale discount
 * @returns {Number} Highest discount
 */

export const getHighestDiscount = discount => {
    const discounts = discount.join(" ").match(/\d{1,2}\s*%/g);
    return discounts ? Math.max(...discounts.map(parseFloat)) : 0;
};

/**
 * Parses sale discounts and gets range of them
 * @param {Array<String>} discount Array of discounts
 * @returns {String} String representation of discounts range, empty string if no discount was found
 */
export const getDiscountRange = discount => {
    const discounts = discount.join(" ").match(/\d{1,2}\s*%/g);
    if (discounts) {
        const discountsValues = uniq(
            discounts
                .map(parseFloat)
                .filter(e => e > 0)
        );
        return discountsValues.length > 1
            ? `${Math.min(...discountsValues)}–${Math.max(...discountsValues)}%`
            : `${discountsValues[0]}%`;
    }
    return "";
};
