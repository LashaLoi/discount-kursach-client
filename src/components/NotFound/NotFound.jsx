import React from "react";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";

import { Button } from "@rmwc/button";
import { Icon} from "@rmwc/icon";
import { Typography } from "@rmwc/typography";

import "./NotFound.scss";

const NotFound = ({ t, title, caption, action }) => {
    return (
        <div className="not-found">
            <div className="glitch title" data-text={title}>{title}</div>
            <div className="glitch caption" data-text={t(caption)}>{t(caption)}</div>
            <Button tag={Link} to="/" outlined className="back">{t(action)}</Button>
        </div>
    );
};

const NotFoundCompact = ({ t, title, caption, action }) => {
    return (
        <div className="not-found-compact">
            <Icon className="icon" icon="location_off" />
            <Typography use="headline6" className="caption">{t(caption)}</Typography>
            <Button theme="secondary" ripple={{ accent: true }}  tag={Link} to="/map" outlined className="back">{t(action)}</Button>
        </div>
    );
};

NotFound.defaultProps = {
    title: "404",
    caption: "notFound",
    action: "backToMain",
};

NotFoundCompact.defaultProps = {
    caption: "benefit_not_found",
    action: "backToMain",
};

const EnhancedNotFound = withNamespaces("common")(NotFound);
const EnhancedNotFoundCompact = withNamespaces("common")(NotFoundCompact);

export {
    EnhancedNotFound as NotFound,
    EnhancedNotFoundCompact as NotFoundCompact,
};

export default withNamespaces("common")(NotFound);
