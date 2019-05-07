import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

import { Icon } from "@rmwc/icon";

import Benefit from "../SideBarBenefit/SideBarBenefit";
import { BenefitLoader as Loader } from "../Loaders";

import "./BenefitsList.scss";
import { sortBenefits } from "../../util/filters";
import { Typography } from "@rmwc/typography";
// import { subscribeToFavoriteToggle } from "../../util/subscriptionHelpers";

export const SearchContext = React.createContext("");

const getItemSize = index => {
    return 166;
};

const getItemKey = (index, data) => {
    if (!data) {
        return index;
    }
    return data[index].id;
};

class BenefitsList extends Component {
    // componentDidMount() {
    //     subscribeToFavoriteToggle(this.props.subscribeToMore, this.props.onSnackbarOpen);
    // }

    shouldComponentUpdate(nextProps, nextState) {
        const equal = (
            this.props.isLoading === nextProps.isLoading &&
            this.props.currentCity.id === nextProps.currentCity.id &&
            isEqual(this.props.filters, nextProps.filters)
        );
        return !equal;
    };

    setListRef = element => {
        this.restoreScroll(element, this.props.scrollOffset);
    };

    restoreScroll = (element, offset) => {
        if (element) {
            element.scrollTo(offset);
        }
    };

    render() {
        const { benefits, isLoading, t, filters, onScroll } = this.props;
        if (isLoading) {
            return (
                <div className="benefit-list loading">
                    {new Array(10).fill(true).map((e, i) => (
                        <Loader key={i} />
                    ))}
                </div>
            );
        }
        const sortedBenefits = sortBenefits(benefits, filters.sortBy, filters.sortOrder);
        if (sortedBenefits.length === 0) {
            return (
                <div className="benefit-list">
                    <div className="missing">
                        <Icon icon="mood_bad" className="icon" />
                        <Typography
                            use="subtitle1"
                            theme="textSecondaryOnBackground"
                            className="caption"
                        >
                            {t("common:no_results")}
                        </Typography>
                    </div>
                </div>
            );
        }
        // const getItemSize = index => {
        //     const numberOfLines = Math.round(sortedBenefits[index].description.length / 41);
        //     /**
        //      * * 112 is heigth of rest of the card, excluding description block
        //      * 
        //      * * numberOfLines is _estimated_ number of lines in description.
        //      * Notice that it works __only with the given font parameters__ (e.g. font-family, font-size, font-weight, etc.)
        //      * 
        //      * * 20 height of the single line. Again, __only with the given font parameters__
        //      */
        //     return 116 + numberOfLines * 20;
        // };
        return (
            <SearchContext.Provider value={`${filters.searchString}` || ""}>
                <div className="benefit-list">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                itemCount={sortedBenefits.length}
                                itemSize={getItemSize}
                                itemData={sortedBenefits}
                                itemKey={getItemKey}
                                height={height}
                                width={width}
                                estimatedItemSize={166}
                                onScroll={onScroll}
                                ref={this.setListRef}
                            >
                                {({ index, style }) => {
                                    return (
                                        <Benefit
                                            key={sortedBenefits[index].id}
                                            benefit={sortedBenefits[index]}
                                            style={style}
                                            t={t}
                                        />
                                    );
                                }}
                            </List>
                        )}
                    </AutoSizer>
                </div>
            </SearchContext.Provider>
        );
    }
}

export default BenefitsList;
