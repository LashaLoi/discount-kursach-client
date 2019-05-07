import React, { Component } from "react";
import { compose, graphql } from "react-apollo";
import ReactStars from "react-stars";

import { Typography } from "@rmwc/typography";
import { Dialog, DialogTitle } from "@rmwc/dialog";
import { TextField } from "@rmwc/textfield";
import { Button } from "@rmwc/button";

// import { GET_USER_VOTES } from "../../queries/user";
import { CREATE_COMMENT, GET_BENEFIT_COMMENTS } from "../../queries/benefits";

import Logger from "../../util/logger";

import "./AboutViewRating.scss";
import Comment from "../Comment/Comment";

const defaultState = {
    showModal: false,
    rating: 0,
    message: "",
};

class AboutViewRating extends Component {
    state = defaultState;

    handleMessageChange = event => {
        const message = event.target.value;
        this.setState({ message });
    };

    handleSubmit = async () => {
        try {
            const { id } = this.props.benefit;
            await this.props.mutate({
                variables: {
                    benefit: this.props.benefit.id,
                    rating: this.state.rating,
                    message: this.state.message,
                },
                optimisticResponse: { setComment: true },
                refetchQueries: [{ query: GET_BENEFIT_COMMENTS, variables: { id } }],
            });
            this.handleModalClose();
        } catch (error) {
            Logger.error(error);
        }
    };

    setPreliminaryRating = rating => {
        this.setState({ rating });
        this.handleModalOpen();
    };

    handleModalOpen = () => {
        this.setState({ showModal: true });
    };

    handleModalClose = () => {
        this.setState(defaultState);
    };

    handleCommentEdit = () => {
        this.setState({
            message: this.props.userComment.message,
            rating: this.props.userComment.rating,
        });
        this.handleModalOpen();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.userRating !== this.props.userRating) {
            this.setState({ rating: this.props.userRating });
        }
    }

    renderHeader = () => {
        const { t } = this.props;
        if (this.props.userComment) {
            return (
                <Comment
                    comment={this.props.userComment}
                    onEdit={this.handleCommentEdit}
                    benefitId={this.props.benefit.id}
                    userComment
                />
            );
        }
        return (
            <>
                <Typography use="subtitle2" className="subtitle">
                    {t("rate_please")}
                </Typography>
                <ReactStars
                    className="stars"
                    value={this.state.rating}
                    count={5}
                    onChange={this.setPreliminaryRating}
                    half={false}
                    size={40}
                    color1={"#e0e0e0"}
                    color2={"#eb1c23"}
                    char={"star"}
                />
            </>
        );
    }

    render() {
        const {
            t,
            benefit,
        } = this.props;

        const isMessageSame = (
            this.props.userComment &&
            this.props.userComment.message.trim() === this.state.message.trim() &&
            this.props.userComment.rating === this.state.rating
        );

        return (
            <div className="rating">
                {this.renderHeader()}
                <Dialog className="dialog" open={this.state.showModal} onClose={this.handleModalClose}>
                    <DialogTitle>{benefit.name}</DialogTitle>
                    <div className="content">
                        <ReactStars
                            className="stars"
                            value={this.state.rating}
                            count={5}
                            onChange={this.setPreliminaryRating}
                            half={false}
                            size={40}
                            color1={"#e0e0e0"}
                            color2={"#eb1c23"}
                            char={"star"}
                        />
                        <TextField
                            textarea
                            outlined
                            fullwidth
                            label={t("comment_please")}
                            value={this.state.message}
                            onChange={this.handleMessageChange}
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
                                disabled={!this.state.message.trim() || isMessageSame}
                                className="action"
                                theme="secondary"
                                ripple={{ accent: true }}
                                onClick={this.handleSubmit}
                            >
                                {t("post")}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default compose(
    graphql(CREATE_COMMENT),
    // graphql(GET_USER_VOTES, {
    //     options: {
    //         variables: {
    //             profileId: extractUserId(),
    //         },
    //     },
    // }),
)(AboutViewRating);
