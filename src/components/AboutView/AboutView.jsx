import React from "react";
import { Link } from "react-router-dom";
import { withNamespaces } from "react-i18next";
import { Query } from "react-apollo";

import { Fab } from "@rmwc/fab";

import { NotFoundCompact } from "../NotFound/NotFound";
import AboutViewHeader from "../AboutViewHeader/AboutViewHeader";
import AboutViewInfo from "../AboutViewInfo/AboutViewInfo";
import CommentList from "../CommentList/CommentList";
import { DescriptionLongLoader as Info, AboutHeaderLoader as Header } from "../Loaders";

import { GET_BENEFIT_BY_ID } from "../../queries/benefits";

import "./AboutView.scss";

const AboutView = ({ match, t }) => {
    const { id } = match.params;
    if (!id) {
        return <NotFoundCompact />;
    }
    return (
        <Query query={GET_BENEFIT_BY_ID} variables={{ id }}>
            {({ loading: getBenefitLoading, data, error, ...rest }) => {
                const isLoading = getBenefitLoading;
                if (isLoading) {
                    return (
                        <div className="about-loading">
                            <Fab className="btn-back" mini tag={Link} to="/map" icon="arrow_back" />
                            <Header />
                            {new Array(3).fill(true).map((e, i) => (
                                <Info key={i} />
                            ))}
                        </div>
                    );
                }
                if (error) {
                    return <NotFoundCompact />;
                }
                return (
                    <div className="content about">
                        <AboutViewHeader benefit={data.getBenefit} t={t} />
                        <AboutViewInfo benefit={data.getBenefit} t={t} />
                        <CommentList t={t} benefit={data.getBenefit} benefitId={data.getBenefit.id} />
                    </div>
                );
            }}
        </Query>
    );
};

export default withNamespaces("about")(AboutView);
