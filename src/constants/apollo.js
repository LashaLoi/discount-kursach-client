export const TOKEN_HEADER = "x-token";
export const REFRESH_TOKEN_HEADER = "x-refresh-token";

export const ERROR_EXTENSION_CODES = {
    UNAUTHENTICATED: "UNAUTHENTICATED",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    BENEFIT_NOT_FOUND: "BENEFIT_NOT_FOUND",
};

export const APOLLO_TYPES = {
    Filters: "Filters",
    Metadata: "Metadata",
    LocalState: "LocalState",
    User: "User",
    Login: "Login",
    App: "App",
};

export const FILTER_TYPES = {
    all: "all",
    favorite: "favorite",
};

export const SORT_TYPES = {
    rating: "rating",
    highestDiscount: "highestDiscount",
    createdAt: "createdAt",
    name: "name",
};

export const SORT_ORDERS = {
    desc: "desc",
    asc: "asc",
};
