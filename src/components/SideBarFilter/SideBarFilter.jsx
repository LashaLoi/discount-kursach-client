import React, { memo } from "react";
import { Mutation, Query } from "react-apollo";

import { Button } from "@rmwc/button";
import { SimpleMenu, MenuItem } from "@rmwc/menu";
import { Typography } from "@rmwc/typography";

import Badge from "../Badge/Badge";

import { GET_ALL_CITIES, UPDATE_CURRENT_CITY } from "../../queries/city";
import { getCurrentCity } from "../../util/filters";

import "./SideBarFilter.scss";

const CityPicker = () => {
    return (
        <Mutation mutation={UPDATE_CURRENT_CITY}>
            {update => (
                <Query query={GET_ALL_CITIES}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            return null;
                        }
                        const getCities = data.getCities;
                        return (
                            <SimpleMenu
                                handle={
                                    <Button
                                        icon="location_on"
                                        dense
                                        className="filter-button button-margin"
                                        outlined
                                        ripple={{ accent: true }}
                                        theme="secondary"
                                    >
                                        {getCurrentCity(getCities).name}
                                    </Button>
                                }
                                anchorCorner="bottomLeft"
                                onSelect={event => update({ variables: { id: event.detail.item.id } })}
                            >
                                {getCities.map(city => (
                                    <MenuItem id={city.id} key={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </SimpleMenu>
                        );
                    }}
                </Query>
            )}
        </Mutation>
    );
};

const SideBarFilters = ({ showBadge, t, onClick, contentLength }) => {
    return (
        <div className="filters">
            <div className="controls">
                <CityPicker />
                <Badge hide={!showBadge} className="button-margin">
                    <Button
                        dense
                        className="filter-button"
                        outlined
                        ripple={{ accent: true }} 
                        theme="secondary"
                        onClick={onClick}
                        icon="filter_list"
                    >
                        {t("filters")}
                    </Button>
                </Badge>
                <Typography
                    className="counter"
                    use="caption"
                    theme="textSecondaryOnBackground"
                >
                    {t("common:nItems", { count: contentLength })}
                </Typography>
            </div>
            {/*  */}
        </div>
    );
};

const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.contentLength === nextProps.contentLength &&
        prevProps.showBadge === nextProps.showBadge
    );
};

export default memo(SideBarFilters, areEqual);
