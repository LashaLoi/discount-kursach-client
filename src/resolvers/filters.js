import _ from "lodash";

import Logger from "../util/logger";
import { getCurrentCity } from "../util/filters";
import { extractUserId } from "../util/tokenParser";

import { APOLLO_TYPES, FILTER_TYPES, SORT_TYPES, SORT_ORDERS } from "../constants/apollo";

import { GET_SIDEBAR_DATA } from "../queries/benefits";
import { GET_ALL_CITIES } from "../queries/city";
import { GET_USER_FAVORITES } from "../queries/user";
import { GET_LOCAL_FILTERS, GET_SEARCH_STRING, GET_FILTERBY, GET_SORTING, GET_CLEARABLE_FILTERS } from "../queries/filters";

const filterBenefits = (cache, filters) => {
    const profileId = extractUserId();

    const { getCities } = cache.readQuery({ query: GET_ALL_CITIES });
    const id = getCurrentCity(getCities).id;
    const { getCity } = cache.readQuery({ query: GET_SIDEBAR_DATA, variables: { id, profileId } });
    const categories = _.cloneDeep(getCity.categories);

    const { getUser } = cache.readQuery({ query: GET_USER_FAVORITES, variables: { profileId } });

    const trimmedString = `${filters.searchString}`.trim().toLowerCase();

    const benefitMaper = benefit => {
        const name = benefit.name.toLowerCase();
        return {
            ...benefit,
            visible: (
                (!filters.categories.length || filters.categories.includes(benefit.categoryId)) &&
                (!trimmedString.length || name.startsWith(trimmedString) || name.includes(trimmedString)) &&
                (filters.filterBy === FILTER_TYPES.all || getUser.favorites.includes(benefit.id))
            ),
        };
    };

    const updatedCategories = categories.map(category => {
        const mapedBenefits = category.benefits
            .map(benefit => ({ ...benefit, categoryId: category.id, categoryName: category.name }))
            .map(benefitMaper);
        return { ...category, benefits: mapedBenefits };
    });
    cache.writeData({ id: getCity.id, data: { ...getCity, updatedCategories } });
};

export const filtersMutationResolvers = {
    updateSearchString: (__, { string: searchString }, { cache }) => {
        try {
            cache.writeQuery({
                query: GET_SEARCH_STRING, data: {
                    filters: {
                        searchString,
                        __typename: APOLLO_TYPES.Filters,
                    },
                },
            });
            const { filters } = cache.readQuery({ query: GET_LOCAL_FILTERS });
            filterBenefits(cache, filters);
        } catch (error) {
            Logger.error(error);
        } finally {
            return null;
        }
    },
    updateCategories: (__, { categoryId }, { cache }) => {
        try {
            const { filters } = cache.readQuery({ query: GET_LOCAL_FILTERS });
            let categories = _.cloneDeep(filters.categories);
            if (categories.includes(categoryId)) {
                categories = categories.filter(id => id !== categoryId);
            } else {
                categories.push(categoryId);
            }
            const data = { filters: { ...filters, categories } };
            cache.writeData({ data });
            filterBenefits(cache, data.filters);
        } catch (error) {
            Logger.error(error);
        } finally {
            return null;
        }
    },

    updateFilterBy: (__, { filter }, { cache }) => {
        try {
            if (!Object.keys(FILTER_TYPES).includes(filter)) {
                throw new Error("Cannot apply filter: no such filter defined");
            }
            cache.writeQuery({
                query: GET_FILTERBY, data: {
                    filters: {
                        __typename: APOLLO_TYPES.Filters,
                        filterBy: filter,
                    },
                },
            });
            const { filters } = cache.readQuery({ query: GET_LOCAL_FILTERS });
            filterBenefits(cache, filters);
        } catch (error) {
            Logger.error(error);
        } finally {
            return null;
        }
    },

    updateSorting: (__, { key, order }, { cache }) => {
        try {
            if (!Object.keys(SORT_TYPES).includes(key) || !Object.keys(SORT_ORDERS).includes(order)) {
                throw new Error(`Cannot apply sorting: no such key or order defined: ${key}, ${order}`);
            }
            cache.writeQuery({
                query: GET_SORTING, data: {
                    filters: {
                        __typename: APOLLO_TYPES.Filters,
                        sortBy: key,
                        sortOrder: order,
                    },
                },
            });
        } catch(e) {
            Logger.error(e);
        } finally {
            return null;
        }
    },

    clearFilters: (__, variables, { cache }) => {
        try {
            cache.writeQuery({
                query: GET_CLEARABLE_FILTERS, data: {
                    filters: {
                        __typename: APOLLO_TYPES.Filters,
                        categories: [],
                        filterBy: FILTER_TYPES.all,
                    },
                },
            });
            const { filters } = cache.readQuery({ query: GET_LOCAL_FILTERS });
            filterBenefits(cache, filters);
        } catch(e) {
            Logger.error(e);
        } finally {
            return null;
        }
    },
};

export const filtersDefaults = {
    __typename: APOLLO_TYPES.Filters,
    categories: [],
    searchString: "",
    filterBy: FILTER_TYPES.all,
    sortBy: SORT_TYPES.rating,
    sortOrder: SORT_ORDERS.desc,
};
