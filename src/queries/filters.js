import gql from "graphql-tag";

export const GET_LOCAL_FILTERS = gql`
  query {
    filters @client {
      categories
      searchString
      filterBy
      sortBy
      sortOrder
    }
  }
`;

export const GET_CLEARABLE_FILTERS = gql`
  query {
    filters @client {
      categories
      filterBy
    }
  }
`;

export const GET_SEARCH_STRING = gql`
  query {
    filters @client {
      searchString
    }
  }
`;

export const GET_CATEGORIES = gql`
  query {
    filters @client {
      categories
    }
  }
`;

export const GET_FILTERBY = gql`
  query {
    filters @client {
      filterBy
    }
  }
`;

export const GET_SORTING = gql`
  query {
    filters @client {
      sortBy
      sortOrder
    }
  }
`;

export const UPDATE_SEARCH_STRING = gql`
    mutation updateSearchString($string: String!) {
        updateSearchString(string: $string) @client
    }
`;

export const UPDATE_CATEGORIES = gql`
    mutation updateCategories($id: String!) {
        updateCategories(categoryId: $id) @client
    }
`;

export const UPDATE_FILTERBY = gql`
    mutation updateFilterBy($filter: String!) {
        updateFilterBy(filter: $filter) @client
    }
`;

export const UPDATE_SORTING = gql`
    mutation updateSorting($key: String!, $order: String!) {
      updateSorting(key: $key, order: $order) @client
    }
`;

export const CLEAR_FILTERS = gql`
    mutation clearFilters {
      clearFilters @client
    }
`;
