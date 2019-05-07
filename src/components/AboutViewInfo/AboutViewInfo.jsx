import React, { Component } from "react";
import { Mutation } from "react-apollo";

import { Typography } from "@rmwc/typography";
import { Button } from "@rmwc/button";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogButton,
} from "@rmwc/dialog";
import { TextField } from "@rmwc/textfield";
import { CircularProgress } from "@rmwc/circular-progress";

import AboutViewListItem from "../AboutViewListItem/AboutViewListItem";

import { ASK_THE_QUESTION, HOVER_LOCATION } from "../../queries/benefits";
import { email } from "../../util/regex";

import "./AboutViewInfo.scss";
import Logger from "../../util/logger";

const defaultState = {
    email: "",
    message: "",
    showModal: false,
    sent: false,
};

class AboutViewInfo extends Component {
    state = defaultState;

    sendMessage = handler => async () => {
        try {
            await handler({
                variables: {
                    message: this.state.message,
                    userEmail: this.state.email,
                    benefitId: this.props.benefit.id,
                },
            });
            this.setState({
                sent: true,
            });
        } catch (e) {
            Logger.error(e);
        }
    };

    resetModal = state => {
        if (state === "closed") {
            this.setState(defaultState);
        }
    };

    handleTextChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    };

    handleModalOpen = () => {
        this.setState({
            showModal: true,
        });
    };

    handleModalClose = () => {
        this.setState({
            showModal: false,
        });
    };

    renderSuccessMessage = () => {
        const { t } = this.props;
        return (
            <>
                <DialogContent>{t("message_sent_hint")}</DialogContent>
                <DialogActions>
                    <DialogButton
                        action="accept"
                        isDefaultAction
                        theme="secondary"
                        ripple={{ accent: true }} 
                    >
                        {t("common:close")}
                    </DialogButton>
                </DialogActions>
            </>
        );
    };

    renderForm = () => {
        const { t } = this.props;
        return (
            <Mutation mutation={ASK_THE_QUESTION}>
                {(askTheQuestion, { loading }) => (
                    <div className="content">
                        <TextField
                            outlined
                            name="email"
                            type="email"
                            label={t("enter_email")}
                            value={this.state.email}
                            onChange={this.handleTextChange}
                            className="email"
                            helpText={t("email_hint")}
                        />
                        <TextField
                            textarea
                            outlined
                            theme="secondary"
                            name="message"
                            label={t("enter_message")}
                            value={this.state.message}
                            onChange={this.handleTextChange}
                            className="textarea"
                            rows={5}
                        />
                        <div className="button-block">
                            <Button
                                className="action"
                                theme="secondary"
                                ripple={{ accent: true }} 
                                onClick={this.handleModalClose}
                            >
                                {t("common:cancel")}
                            </Button>
                            <Button
                                disabled={
                                    loading ||
                                    !this.state.message.trim() ||
                                    !email.test(this.state.email.trim())
                                }
                                className="action"
                                theme="secondary"
                                ripple={{ accent: true }} 
                                onClick={this.sendMessage(askTheQuestion)}
                            >
                                {loading ? <CircularProgress theme="secondary" /> : t("post")}
                            </Button>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    };

    render() {
        const {
            benefit,
            t,
        } = this.props;
        return (
            <div className="info">
                <AboutViewListItem icon="info">
                    <Typography use="body1">{benefit.description}</Typography>
                </AboutViewListItem>
                <hr />
                <AboutViewListItem icon="card_giftcard">
                    {benefit.discount.map((discount, i) => (
                        <Typography key={i} tag="p" className="discount" use="body1">{discount}</Typography>
                    ))}
                </AboutViewListItem>
                <hr />
                <AboutViewListItem icon="access_time">
                    <Typography use="body1">{benefit.working}</Typography>
                </AboutViewListItem>
                {benefit.locations.map(location => {
                    return (
                        <Mutation key={location.id} mutation={HOVER_LOCATION}>
                            {hoverLocation => (
                                <AboutViewListItem icon="location_on">
                                    <Typography
                                        use="body1"
                                        className="location"
                                        onMouseEnter={() => hoverLocation({ variables: { id: location.id, hoverState: true } })}
                                        onMouseLeave={() => hoverLocation({ variables: { id: location.id, hoverState: false } })}
                                    >
                                        {location.address}
                                    </Typography>
                                </AboutViewListItem>
                            )}
                        </Mutation>
                    );
                })}
                <AboutViewListItem icon="phone" accent>
                    <Typography tag="a" href={`tel:${benefit.phone}`} use="body1">{benefit.phone}</Typography>
                </AboutViewListItem>
                <AboutViewListItem icon="web" accent>
                    <Typography target="_blank" tag="a" href={`${benefit.link}`} use="body1">{benefit.link}</Typography>
                </AboutViewListItem>
                <AboutViewListItem icon="help" accent>
                    <Typography onClick={this.handleModalOpen} className="btn-help" use="body1">{t("ask_the_question")}</Typography>
                </AboutViewListItem>
                <hr />
                <Dialog
                    className="dialog"
                    open={this.state.showModal}
                    onClose={this.handleModalClose}
                    onStateChange={this.resetModal}
                >
                    <DialogTitle>{this.state.sent ? t("message_sent") : t("ask_the_question")}</DialogTitle>
                    {this.state.sent ? this.renderSuccessMessage() : this.renderForm()}
                </Dialog>
            </div>
        );
    }
}

export default AboutViewInfo;
