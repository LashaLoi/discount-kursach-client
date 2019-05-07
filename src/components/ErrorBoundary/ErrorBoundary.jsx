import React from "react";

import Logger from "../../util/logger";

// import NotFound from "../NotFound/NotFound";

import "./ErrorBoundary.scss";

class ErrorBoundary extends React.Component {
    state = {
        error: null,
        errorInfo: null,
    };

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });
        Logger.error(error, errorInfo);
        // TODO: add error logging service
    }

    render() {
        if(this.state.errorInfo) {
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: "pre-wrap" }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
