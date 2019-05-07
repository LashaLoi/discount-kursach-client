import React, { Component } from "react";
import PropTypes from "prop-types";
import { VariableSizeList as List } from "react-window";

import BenefitsList from "../BenefitsList/BenefitsList";
import SideBarFilter from "../SideBarFilter/SideBarFilter";
import SideBarSearch from "../SideBarSearch/SideBarSearch";

import "./ListViewContent.scss";

export const SearchContext = React.createContext("");

class ListViewContent extends Component {
    static propTypes = {
        benefits: PropTypes.array,
    };

    static defaultProps = {
        benefits: [],
    };

    state = {
        showFavorites: false,
    };

    handleChipSelect = (event, handler) => {
        const chipId = event.detail.chipId;
        handler({ variables: { id: chipId } });
    }

    handleSearch = (event, handler) => {
        const value = event.target.value;
        handler({ variables: { string: value } });
    }

    handleShowFilter = () => {
        this.setState(state => ({
            showFilter: !state.showFilter,
        }));
    }

    render() {
        const { t, visibleBenefits, filters, categories, isLoading } = this.props;
        return (
            <div className={`content list ${isLoading ? "loading" : ""}`}>
                <SideBarSearch
                    t={t}
                    onChange={this.handleSearch}
                    value={filters.search}
                />
                <SideBarFilter
                    t={t}
                    onClick={this.handleShowFilter}
                    show={this.state.showFilter}
                    onChipSelect={this.handleChipSelect}
                    selectedChips={filters.categories}
                    categories={categories}
                    filterBy={filters.filterBy}
                />
                <BenefitsList
                    t={t}
                    benefits={visibleBenefits}
                    isLoading={isLoading}
                    searchString={filters.searchString}
                />
            </div>
        );
    }
}

export default ListViewContent;
