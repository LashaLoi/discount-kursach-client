import React, { memo } from "react";
import { Mutation } from "react-apollo";

import { Button } from "@rmwc/button";
import { IconButton } from "@rmwc/icon-button";
import { Chip, ChipSet } from "@rmwc/chip";
import { Radio } from "@rmwc/radio";
import { Typography } from "@rmwc/typography";

import { UPDATE_CATEGORIES, UPDATE_FILTERBY, CLEAR_FILTERS } from "../../queries/filters";
import { getCategoryIcon } from "../../constants/categories";
import { FILTER_TYPES } from "../../constants/apollo";

import "./FiltersPanel.scss";

const handleKeyPress = (event, handler) => {
    if (event.key === "Escape") {
        handler(event);
    }
};

const FiltersPanel = ({ t, categories, show, onClick, filters, rootRef }) => {
    const { filterBy, categories: selectedChips } = filters;
    const filtersApplied = (
        filterBy !== FILTER_TYPES.all ||
        selectedChips.length !== 0
    );
    return (
        <div ref={rootRef} className={`category-filter ${show ? "show" : "hide"}`} onKeyDown={event => handleKeyPress(event, onClick)} tabIndex="1">
            <IconButton className="back" icon="close" onClick={onClick} />
            <div className="content">
                <Typography use="headline5">{t("filters")}</Typography>
                <hr />
                <div className="radio-set">
                    <Mutation mutation={UPDATE_FILTERBY}>
                        {(updateFilterBy) => {
                            return Object.keys(FILTER_TYPES).map(key => {
                                return (
                                    <Radio
                                        key={FILTER_TYPES[key]}
                                        value={FILTER_TYPES[key]}
                                        checked={filterBy === FILTER_TYPES[key]}
                                        onChange={evt => {
                                            updateFilterBy({ variables: { filter: FILTER_TYPES[key] } });
                                        }}
                                    >
                                        {t(FILTER_TYPES[key])}
                                    </Radio>
                                );
                            });
                        }}
                    </Mutation>
                </div>
                <hr />
                <Typography use="subtitle1">{t("categories")}</Typography>
                <Mutation mutation={UPDATE_CATEGORIES}>
                    {updateCategories => (
                        <ChipSet filter >
                            {categories.map(category => (
                                <Chip
                                    key={category.id}
                                    checkmark
                                    icon={getCategoryIcon(category.name).icon}
                                    selected={selectedChips.indexOf(category.id) >= 0}
                                    id={category.id}
                                    onInteraction={event => updateCategories({ variables: { id: event.detail.chipId } })}
                                >
                                    {category.name}
                                </Chip>

                            ))}
                        </ChipSet>
                    )}
                </Mutation>
            </div>
            <div className="footer">
                <Mutation mutation={CLEAR_FILTERS}>
                    {clearFilters => filtersApplied && (
                        <Button className="btn" onClick={clearFilters} outlined theme="secondary" ripple={{ accent: true }} >
                            {t("clear_filters")}
                        </Button>
                    )}
                </Mutation>
                <Button className="btn" theme="secondary" ripple={{ accent: true }}  onClick={onClick}>{t("common:close")}</Button>
            </div>
        </div>
    );
};

export default memo(FiltersPanel);
