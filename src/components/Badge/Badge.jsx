import React from "react";
import PropTypes from "prop-types";

import "./Badge.scss";

const Badge = ({ children, tag: Tag, className, hide, ...rest }) => (
    <Tag className={`badge-wrap ${!!className && className}`} {...rest}>
        {children}
        <span className={`badge ${hide ? "hide" : ""}`} />
    </Tag>
);

Badge.propTypes = {
    tag: PropTypes.string,
};

Badge.defaultProps = {
    tag: "span",
    hide: false,
};

export default Badge;
