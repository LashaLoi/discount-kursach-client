import React from "react";

import { LogoRed } from "../Icons";

import "./Splash.scss";

const Splash = ({ t }) => {
    return (
        <div className="splash">
            <LogoRed />
            <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>
    );
};

export default Splash;
