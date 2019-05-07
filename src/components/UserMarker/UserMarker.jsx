import React from "react";
import { withNamespaces } from "react-i18next";
import "./UserMarker.scss";
import { Icon } from "@rmwc/icon";

const UserMarker = () => {
    return (
        <div className="marker-wrap">
            <div className="user-marker center">
                <Icon icon="place" />
            </div>
            <div className="ripple"></div>
        </div>
    );
};

export default withNamespaces("main")(UserMarker);
