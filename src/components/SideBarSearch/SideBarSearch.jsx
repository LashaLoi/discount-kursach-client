import React, { PureComponent } from "react";
import throttle from "lodash/throttle";
import { graphql } from "react-apollo";

import { TextField } from "@rmwc/textfield";

import { UPDATE_SEARCH_STRING } from "../../queries/filters";

class SideBarSearch extends PureComponent {
    state = {
        value: `${this.props.value}`,
    };

    handleChange = value => {
        this.props.mutate({ variables: { string: value } });
    }

    handleClear = () => {
        this.props.mutate({ variables: { string: "" } });
        this.setState({ value: "" });
    }

    throttledHandleChange = event => {
        const { value } = event.target;
        this.setState({ value });
        throttle(
            this.handleChange,
            100,
            {
                leading: false,
                trailing: true,
            }
        )(value);
    };

    render() {
        const {
            t,
        } = this.props;
        return (
            <TextField
                className="search mdc-theme--secondary"
                onChange={this.throttledHandleChange}
                value={this.state.value}
                outlined
                icon="search"
                trailingIcon={{
                    icon: "close",
                    onClick: this.handleClear,
                    style: {
                        visibility: !this.state.value ? "hidden" : "visible",
                    },
                }}
                label={t("search")}
            />
        );
    }
}

export default graphql(UPDATE_SEARCH_STRING)(SideBarSearch);
