import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";
import { compose, graphql, Query } from "react-apollo";

import { Snackbar } from "@rmwc/snackbar";

import BenefitsList from "../BenefitsList/BenefitsList";
import ListViewHeader from "../ListViewHeader/ListViewHeader";

import { GET_LOCAL_FILTERS } from "../../queries/filters";
import { GET_SIDEBAR_DATA } from "../../queries/benefits";
import { GET_USER_FAVORITES } from "../../queries/user";

import { getBenefitsList, getVisibleBenefits } from "../../util/filters";
import { extractUserId } from "../../util/tokenParser";

import "./ListView.scss";

const defaultData = {
    getCity: {
        categories: [],
    },
    getUser: {
        favorites: [],
    },
};

export const FavoritesContext = React.createContext([]);

class ListView extends PureComponent {
    static propTypes = {
        benefits: PropTypes.array,
    };

    static defaultProps = {
        benefits: [],
    };

    state = {
        snackbarOpen: false,
        message: "",
    };

    handleSnackbarOpen = added => {
        this.setState({
            snackbarOpen: true,
            message: this.props.t(`about:${added ? "added_to_favorite" : "removed_from_favorite"}`),
        });
    };

    handleSnackbarClose = () => {
        this.setState({
            snackbarOpen: false,
            message: "",
        });
    };

    render() {
        const {
            t,
            currentCity,
            data: {
                filters,
                loading: filtersLoading,
            },
            onScroll,
            onCityPickerOpen,
            scrollOffset,
        } = this.props;
        if (filtersLoading) return null;
        return (
            <Query query={GET_SIDEBAR_DATA} variables={{ id: currentCity.id }}>
                {({
                    loading: getCityLoading,
                    error: getCityError,
                    data: getCityData,
                }) => {
                    const data = Object.keys(getCityData || {}).length ? getCityData : defaultData;
                    const isLoading = getCityLoading;

                    const benefits = getBenefitsList(data.getCity.categories);
                    const visibleBenefits = getVisibleBenefits(benefits);
                    return (
                        <>
                            <ListViewHeader
                                t={t}
                                categories={data.getCity.categories}
                                filters={filters}
                                currentCity={currentCity}
                                onCityPickerOpen={onCityPickerOpen}
                            />
                            <Query query={GET_USER_FAVORITES} variables={{ profileId: extractUserId() }}>
                                {({ data: favoritesData = {}, loading, error, subscribeToMore }) => {
                                    if (error) {
                                        return null;
                                    }
                                    const getUser = favoritesData.getUser || { favorites: [] };
                                    return (
                                        <FavoritesContext.Provider value={getUser.favorites}>
                                            <BenefitsList
                                                t={t}
                                                onScroll={onScroll}
                                                scrollOffset={scrollOffset}
                                                benefits={visibleBenefits}
                                                isLoading={isLoading}
                                                searchString={filters.searchString}
                                                filters={filters}
                                                currentCity={currentCity}
                                                subscribeToMore={subscribeToMore}
                                                onSnackbarOpen={this.handleSnackbarOpen}
                                            />
                                        </FavoritesContext.Provider>
                                    );
                                }}
                            </Query>
                            <Snackbar
                                open={this.state.snackbarOpen}
                                onClose={this.handleSnackbarClose}
                                message={this.state.message}
                                leading
                                timeout={3000}
                                dismissesOnAction
                            />

                        </>
                    );
                }}
            </Query>
        );
    }
}

export default compose(
    graphql(GET_LOCAL_FILTERS),
    withNamespaces("main"),
)(ListView);
