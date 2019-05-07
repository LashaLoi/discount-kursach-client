import React, { Component } from "react";
import { Query } from "react-apollo";

import { Typography } from "@rmwc/typography";

import Comment from "../Comment/Comment";
import AboutViewRating from "../AboutViewRating/AboutViewRating";

// import { subscribeToDeleteComments, subscribeToNewComments, subscribeToVoteSet } from "../../util/subscriptionHelpers";
import { extractUserId } from "../../util/tokenParser";
import { GET_BENEFIT_COMMENTS } from "../../queries/benefits";

import "./CommentList.scss";

const compareFn = (a, b) => a.created < b.created;

class CommentList extends Component {
    render() {
        const { benefit } = this.props;
        const userId = `${extractUserId()}`;
        return (
            <Query
                query={GET_BENEFIT_COMMENTS}
                variables={{ id: benefit.id }}
                fetchPolicy="network-only"
            >
                {({ data, loading: commentsLoading, error, stopPolling, networkStatus, subscribeToMore }) => {
                    if (error) {
                        stopPolling();
                        return null;
                    }
                    if (commentsLoading && networkStatus !== 6) {
                        return null;
                    }

                    const comments = data.getBenefit.comments;
                    const filteredComments = comments.filter(comment => comment.userId !== userId);

                    const userComment = data.getBenefit.comments.find(comment => {
                        return `${comment.userId}` === `${userId}`;
                    });

                    return <Comments
                        {...this.props}
                        userComment={userComment}
                        comments={filteredComments}
                        subscribeToMore={subscribeToMore}
                    />;
                }}
            </Query>
        );
    }
}

class Comments extends React.Component {
    // componentDidMount() {
    //     const { subscribeToMore, benefit } = this.props;
    //     subscribeToNewComments(subscribeToMore, { benefitId: benefit.id });
    //     subscribeToDeleteComments(subscribeToMore, { benefitId: benefit.id });
    //     subscribeToVoteSet(subscribeToMore, { benefitId: benefit.id });
    // }

    render() {
        const { benefit, userComment, comments, t } = this.props;
        return (
            <>
                <AboutViewRating benefit={benefit} t={t} userComment={userComment} />
                <hr />
                <div className="comment-list">
                    <Typography use="subtitle1" className="subtitle">
                        {t("n_reviews", { count: comments.length })}
                    </Typography>
                    {!comments.length && (
                        <Typography use="caption" theme="textSecondaryOnBackground" className="missing">
                            {t("no_reviews")}
                        </Typography>
                    )}
                    {comments.sort(compareFn).map(comment => {
                        return (
                            <Comment
                                key={comment.id}
                                comment={comment}
                                userComment={comment.userId === `${extractUserId()}`}
                            />
                        );
                    })}
                </div>
            </>
        );
    }
}

export default CommentList;
