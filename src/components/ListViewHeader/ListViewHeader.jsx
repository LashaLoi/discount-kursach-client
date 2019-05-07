import React, { PureComponent } from "react";
import { Mutation, Query } from "react-apollo";

import { IconButton } from "@rmwc/icon-button";
import { MenuItem, SimpleMenu } from "@rmwc/menu";
import { Icon } from "@rmwc/icon";
import { Avatar } from "@rmwc/avatar";
import { Button } from "@rmwc/button";

import SideBarSearch from "../SideBarSearch/SideBarSearch";
import FiltersPanel from "../FiltersPanel/FiltersPanel";
import Badge from "../Badge/Badge";

import { LOGOUT } from "../../queries/metadata";

import { GET_BASIC_USER_DATA } from "../../queries/user";
import { UPDATE_SORTING } from "../../queries/filters";
import { extractUserId } from "../../util/tokenParser";
import { SORT_TYPES, SORT_ORDERS } from "../../constants/apollo";

import "./ListViewHeader.scss";
import ConfirmationDialog from "../ConfirmationDialog";
import { languages } from "../../constants/languages";
import i18n from "../../i18n";

const getAllSortings = (types, orders) => {
    return Object.keys(types).map(key => {
        return Object.keys(orders).map(order => {
            return { key: types[key], order: orders[order] };
        });
    }).flat();
};

class ListViewHeader extends PureComponent {
    state = {
        showLangPicker: false,
        showFilter: false,
    };

    panelRef = React.createRef();

    handleSearch = (event, handler) => {
        const value = event.target.value;
        handler({ variables: { string: value } });
    }

    handleShowFilter = () => {
        this.setState(state => ({
            showFilter: !state.showFilter,
        }), () => {
            const current = this.panelRef.current;
            if (current) {
                this.state.showFilter
                    ? current.focus()
                    : current.blur();
            }
        });
    }

    handleLangPickerToggle = show => () => {
        this.setState({
            showLangPicker: show,
        });
    };

    handleLangPickerAccept = locale => {
        i18n.changeLanguage(locale);
    };

    render() {
        const {
            t,
            filters,
            categories,
            onCityPickerOpen,
            currentCity,
        } = this.props;

        const sortings = getAllSortings(SORT_TYPES, SORT_ORDERS);

        return (
            <div className="listview-header">
                <div className="row">
                    <SideBarSearch
                        t={t}
                        onChange={this.handleSearch}
                        value={filters.searchString}
                    />
                    <IconButton
                        icon="help"
                        tag="a"
                        href={process.env.REACT_APP_HELP_URI}
                        target="_blank"
                        title={t("support")}
                        className="help"
                    />
                    <Query query={GET_BASIC_USER_DATA} variables={{ profileId: extractUserId() }}>
                        {({ data, loading, error }) => {
                            const getUser = loading || error
                                ? { image: "account_circle", firstName: "", lastName: "" }
                                : data.getUser;
                            const fullName = `${getUser.firstName} ${getUser.lastName}`;
                            return (
                                <SimpleMenu
                                    rootProps={{ className: "account" }}
                                    anchorCorner="topEnd"
                                    className="menu"
                                    handle={
                                        <IconButton
                                            icon={
                                                <Avatar
                                                    src={getUser.image}
                                                    name={fullName}
                                                />
                                            }
                                            className="avatar"
                                        />
                                    }
                                >
                                    <div className="title">
                                        <Avatar
                                            src={getUser.image}
                                            name={fullName}
                                            className="menu-avatar"
                                            size="large"
                                        />
                                        {fullName}
                                    </div>
                                    <hr />
                                    <MenuItem onClick={onCityPickerOpen}>
                                        <Icon className="item-icon" icon="location_on" />
                                        {t(`common:cities.${currentCity.name}`)}
                                    </MenuItem>
                                    <MenuItem onClick={this.handleLangPickerToggle(true)}>
                                        <Icon className="item-icon" icon="language" />
                                        {languages.find(lang => lang.key === localStorage.getItem("i18nextLng")).value}
                                    </MenuItem>
                                    <hr />
                                    <MenuItem tag="a" href={process.env.REACT_APP_HELP_URI} target="_blank">
                                        <Icon className="item-icon" icon="help" />
                                        {t("support")}
                                    </MenuItem>
                                    <MenuItem tag="a" href={process.env.REACT_APP_MOBILE_LINK}>
                                        <Icon className="item-icon" icon="smartphone" />
                                        {t("get_mobile")}
                                    </MenuItem>
                                    <hr />
                                    <Mutation mutation={LOGOUT}>
                                        {logout => (
                                            <MenuItem onClick={logout}>
                                                <Icon className="item-icon" icon="exit_to_app" />
                                                {t("logOut")}
                                            </MenuItem>
                                        )}
                                    </Mutation>
                                </SimpleMenu>
                            );
                        }}
                    </Query>
                </div>
                <div className="filters">
                    <div className="controls">
                        <Mutation mutation={UPDATE_SORTING}>
                            {updateSorting => (
                                <SimpleMenu
                                    handle={
                                        <Button
                                            dense
                                            className="sort-button"
                                            outlined
                                            ripple={{ accent: true }}
                                            theme="secondary"
                                            icon="sort_by_alpha"
                                        >
                                            {t("sorting")}
                                        </Button>
                                    }
                                    anchorCorner="bottomLeft"
                                    onSelect={event => {
                                        const { index } = event.detail;
                                        const { order, key } = sortings[index];
                                        updateSorting({
                                            variables: { key, order },
                                        });
                                    }}
                                >
                                    {sortings.map(({ key, order }, i) => {
                                        const selected = filters.sortBy === key && filters.sortOrder === order;
                                        return (
                                            <MenuItem
                                                key={`${key}_${order}`}
                                                selected={selected}
                                                className="menu-item"
                                            >
                                                <div className="icon-placeholder">
                                                    {selected && <Icon icon="check" />}
                                                </div>
                                                {t(`${key}_${order}`)}
                                            </MenuItem>
                                        );
                                    })}
                                </SimpleMenu>
                            )}
                        </Mutation>
                        <Badge hide={!filters.categories.length} className="button-margin">
                            <Button
                                dense
                                className="filter-button"
                                outlined
                                ripple={{ accent: true }}
                                theme="secondary"
                                onClick={this.handleShowFilter}
                                icon="filter_list"
                            >
                                {t("filters")}
                            </Button>
                        </Badge>
                    </div>
                </div>
                <FiltersPanel
                    t={t}
                    categories={categories}
                    filters={filters}
                    show={this.state.showFilter}
                    onClick={this.handleShowFilter}
                    rootRef={this.panelRef}
                />
                <ConfirmationDialog
                    collection={languages}
                    defautlSelectedKey={localStorage.getItem("i18nextLng")}
                    title="pick_lang"
                    open={this.state.showLangPicker}
                    onClose={this.handleLangPickerToggle(false)}
                    onAccept={this.handleLangPickerAccept}
                    cancellable
                />
            </div>
        );
    }
}

export default ListViewHeader;
