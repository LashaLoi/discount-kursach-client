import React, { memo } from "react";
import PropTypes from "prop-types";

import { Icon } from "@rmwc/icon";

import "./Tooltip.scss";

const Tooltip = ({
    children,
    title,
    rating,
    discountRange,
    show,
}) => {
    return (
        <div className="tooltip-wrap">
            {children}
            <div className={`tooltip ${show && "show"}`}>
                <span className="title">{title}</span>
                <div className="info">
                    <Icon icon={{ icon: "star", size: "xsmall" }} />
                    <span>{rating}</span>
                    {discountRange && (
                        <>
                            <Icon icon={{ icon: "card_giftcard", size: "xsmall" }} />
                            <span>{discountRange}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

Tooltip.propTypes = {
    title: PropTypes.string.isRequired,
    rating: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    highestDiscount: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

export default memo(Tooltip);
