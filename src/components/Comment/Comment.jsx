import React from "react";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/en-gb";
import "moment/locale/be";

import { Icon } from "@rmwc/icon";
import { IconButton } from "@rmwc/icon-button";
import { Typography } from "@rmwc/typography";
import { Avatar } from "@rmwc/avatar";

import { Mutation } from "react-apollo";
import { DELETE_COMMENT, RATE_COMMENT, GET_COMMENT, GET_BENEFIT_COMMENTS } from "../../queries/benefits";

import { extractUserId } from "../../util/tokenParser";

import "./Comment.scss";

const checkIfVoted = (votes, userId) => {
    return votes.map(vote => vote.userId).includes(`${userId}`);
};

const Comment = ({ comment, userComment, onEdit, benefitId }) => {
    moment.locale(localStorage.getItem("i18nextLng"));
    const userId = extractUserId();
    const {
        id,
        message,
        firstName,
        lastName,
        created,
        rating,
        votes,
    } = comment;
    return (
        <div className={`comment ${userComment ? "user-comment" : ""}`} >
            <Avatar className="avatar" name={`${firstName} ${lastName}`} size="large" />
            <div className={`content ${userComment ? "" : "border"}`}>
                <Typography className="username" use="subtitle2">{`${firstName} ${lastName}`}</Typography>
                <div className="secondary">
                    {new Array(5).fill(0).map((e, i) => {
                        return (
                            <Icon
                                key={`${id}-${i}`}
                                icon={{
                                    icon: "star",
                                    size: "xsmall",
                                }}
                                className={`star ${rating > i ? "active" : ""}`}
                            />
                        );
                    })}
                    <Typography className="date" use="caption" theme="textSecondaryOnBackground">
                        {moment(created).format("LL")}
                    </Typography>
                </div>
                <Typography className="body" use="body2">
                    {`${message}`.split("\n").map((e, i) => <p key={i}>{e}</p>)}
                </Typography>
                {!userComment
                    ? (
                        <Mutation 
                            mutation={RATE_COMMENT}
                            variables={{ commentId: id }}
                            refetchQueries={[{ query: GET_COMMENT, variables: { id } }]}
                        >
                            {vote => (
                                <div className={`votes ${checkIfVoted(votes, userId) ? "active" : ""}`}>
                                    <IconButton
                                        role="button"
                                        className="thumb"
                                        icon={{
                                            icon: "thumb_up",
                                            size: "small",
                                        }}
                                        onClick={vote}
                                    />
                                    {!!votes.length && <span>{votes.length}</span>}
                                </div>
                            )}
                        </Mutation>
                    )
                    : (
                        !!votes.length && <div className="votes">
                            <Icon
                                className="thumb"
                                icon={{
                                    icon: "thumb_up",
                                    size: "small",
                                }}
                            />
                            <span>{votes.length}</span>
                        </div>
                    )
                }
                {userComment && (
                    <div className="action-block">
                        <IconButton
                            className="action"
                            icon={{
                                icon: "edit",
                                size: "small",
                            }}
                            onClick={onEdit}
                        />
                        <Mutation
                            mutation={DELETE_COMMENT}
                            variables={{ id }}
                            optimisticResponse={{ deleteComment: true }}
                            refetchQueries={[{ query: GET_BENEFIT_COMMENTS, variables: { id: benefitId } }]}
                        >
                            {deleteComment => (
                                <IconButton
                                    className="action"
                                    icon={{
                                        icon: "delete",
                                        size: "small",
                                    }}
                                    onClick={deleteComment}
                                />
                            )}
                        </Mutation>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Comment;
