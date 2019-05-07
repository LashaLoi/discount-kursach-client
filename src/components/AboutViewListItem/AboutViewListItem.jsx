import React, { memo } from "react";

import { Icon } from "@rmwc/icon";

import "./AboutViewListItem.scss";

const AboutViewListItem = ({ children, icon, accent, ...rest }) => {
    const className = [
        "list-item",
        accent ? "accent" : "",
        rest.className ? rest.className : "",
    ].join(" ").trim();
    return (
        <div {...rest} className={className}>
            <Icon className="icon" icon={icon} />
            <div className="content">{children}</div>
        </div>
    );
};

export default memo(AboutViewListItem);
