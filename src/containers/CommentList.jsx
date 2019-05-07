import React, { Component } from "react";
import { Query } from "react-apollo";

import Comments from "../components/CommentList/CommentList";

import { GET_BENEFIT_COMMENTS } from "../queries/benefits";

import { extractUserId } from "../util/tokenParser";
import { subscribeToDeleteComments, subscribeToNewComments } from "../util/subscriptionHelpers";

class CommentList extends Component {
    render() {
        const { t, benefit } = this.props;
        const userId = extractUserId();
        return (
            <Query query={GET_BENEFIT_COMMENTS} variables={{ id: benefit.id }} fetchPolicy="network-only">
                {({ data, loading: commentsLoading, error, stopPolling, networkStatus, subscribeToMore }) => {
                    if (error) {
                        stopPolling();
                        return null;
                    }
                    if (commentsLoading && networkStatus !== 6) {
                        return null;
                    }
                    const userComment = data.getBenefit.comments.find(comment => {
                        return `${comment.userId}` === `${userId}`;
                    });

                    return (
                        <Comments
                            benefit={benefit}
                            comments={data.getBenefit.comments}
                            t={t}
                            userComment={userComment}
                            userRating={data.getBenefit.userRating}
                            onSubscribeToNew={subscribeToNewComments(subscribeToMore, { benefitId: benefit.id })}
                            onSubscribeToDelete={subscribeToDeleteComments(subscribeToMore, { benefitId: benefit.id })}
                        />
                    );
                }}
            </Query>
        );
    }
}

export default CommentList;
