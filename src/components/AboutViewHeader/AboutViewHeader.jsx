import React, { PureComponent, Component } from "react";
import { compose, graphql, Query } from "react-apollo";
import { Link } from "react-router-dom";

import { Icon } from "@rmwc/icon";
import { Typography } from "@rmwc/typography";
import { Fab } from "@rmwc/fab";
import { Snackbar } from "@rmwc/snackbar";

import { TOGGLE_FAVORITE, GET_BENEFIT_RATING } from "../../queries/benefits";
import { GET_USER_FAVORITES } from "../../queries/user";
import { updateAfterLike } from "../../resolvers/benefits";

import { extractUserId } from "../../util/tokenParser";

import "./AboutViewHeader.scss";
// import { subscribeToRatingSet } from "../../util/subscriptionHelpers";

class AboutViewHeader extends PureComponent {
    state = {
        snackbarShow: false,
    };

    openSnackbar = () => {
        this.setState({ snackbarShow: true });
    }

    closeSnackbar = () => {
        this.setState({ snackbarShow: false });
    }

    render() {
        const {
            benefit,
            mutate: toggleFavorite,
            userFavorites,
            t,
        } = this.props;
        const { id } = benefit;
        return (
            <>
                <div className="about header">
                    <Fab className="btn-back" mini tag={Link} to="/map" icon="arrow_back" />
                    <img className="hero-img" src={benefit.url} alt="" />
                    <div className="title-container">
                        <Fab
                            title={t("add_to_favorite")}
                            className={`btn-like ${userFavorites.includes(id) ? "active" : ""}`}
                            icon={userFavorites.includes(id) ? "bookmark" : "bookmark_border"}
                            onClick={() => {
                                toggleFavorite({
                                    update: updateAfterLike(id),
                                    variables: { id },
                                });
                                this.openSnackbar();
                            }}
                        />
                        <Typography use="headline6">{benefit.name}</Typography>
                        <div className="subtitle">
                            <Query query={GET_BENEFIT_RATING} variables={{ id }} fetchPolicy="network-only">
                                {({ data, loading, error, subscribeToMore }) => {
                                    const rating = loading || error || !data.getBenefit ? 0 : data.getBenefit.rating;
                                    return <Stars subscribeToMore={subscribeToMore} benefitId={id} rating={rating} />;
                                }}
                            </Query>
                            <span className="bullet">•</span>
                            {benefit.parentCategory.name}
                        </div>
                    </div>
                </div>
                <Snackbar
                    open={this.state.snackbarShow}
                    onClose={this.closeSnackbar}
                    message={t(userFavorites.includes(id) ? "added_to_favorite" : "removed_from_favorite")}
                    leading
                    timeout={3000}
                    dismissesOnAction
                />
            </>
        );
    }
}

class Stars extends Component {
    // componentDidMount() {
    //     const { subscribeToMore, benefitId } = this.props;
    //     subscribeToRatingSet(subscribeToMore, { benefitId });
    // }

    shouldComponentUpdate(nextProps) {
        return this.props.rating !== nextProps.rating;
    }

    render () {
        const { rating } = this.props;
        return new Array(5).fill(0).map((e, i) => {
            return (
                <Icon
                    key={i}
                    icon={{
                        icon: rating > i ? "star" : "star_border",
                        size: "xsmall",
                    }}
                />
            );
        });
    }
}

const extractFavorites = (data) => {
    if (data.loading || data.error) {
        return [];
    }
    const getUser = data.getUser || { favorites: [] };
    return getUser.favorites;
};

export default compose(
    graphql(TOGGLE_FAVORITE, {
        options: {
            optimisticResponse: { toggleFavorite: true },
        },
    }),
    graphql(GET_USER_FAVORITES, {
        options: {
            variables: { profileId: extractUserId() },
        },
        props: ({ data, ownProps }) => ({
            ...ownProps,
            userFavorites: extractFavorites(data),
        }),
    }),
)(AboutViewHeader);
