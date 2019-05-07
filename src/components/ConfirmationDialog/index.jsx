import React, { Component } from "react";
import PropTypes from "prop-types";
import { withNamespaces } from "react-i18next";

import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogButton,
} from "@rmwc/dialog";
import { List, ListItem, ListItemMeta } from "@rmwc/list";
import { Radio } from "@rmwc/radio";

import "./styles.scss";

class ConfirmationDialog extends Component {
    static propTypes = {
        collection: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            value: PropTypes.string,
        })),
    };

    static defaultProps = {
        collection: [],
    };

    state = {
        selected: this.props.defautlSelectedKey,
    };

    handleSelect = key => () => {
        this.setState({ selected: key });
    };

    handleAccept = () => {
        if (this.props.onAccept) {
            this.props.onAccept(this.state.selected);
        }
    };
    
    render() {
        const {
            open,
            onClose,
            title,
            cancellable,
            collection,
            t,
        } = this.props;
        return (
            <Dialog open={open} onClose={onClose} className={`confirmation-dialog ${cancellable ? "cancellable" : ""}`}>
                <DialogTitle>{t(title)}</DialogTitle>
                <div className="content">
                    <List>
                        {collection.map(item => {
                            return (
                                <ListItem key={item.key} onClick={this.handleSelect(item.key)}>
                                    {item.value}
                                    <ListItemMeta>
                                        <Radio theme="secondary" readOnly checked={this.state.selected === item.key} />
                                    </ListItemMeta>
                                </ListItem>
                            );
                        })}
                    </List>
                </div>
                <DialogActions>
                    {cancellable && (
                        <DialogButton
                            action="close"
                            theme="secondary"
                            ripple={{ accent: true }}
                            onClick={onClose}
                        >
                            {t("cancel")}
                        </DialogButton>
                    )}
                    <DialogButton
                        action="accept"
                        isDefaultAction
                        theme="secondary"
                        ripple={{ accent: true }}
                        disabled={!this.state.selected}
                        onClick={this.handleAccept}
                    >
                        {t("select")}
                    </DialogButton>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withNamespaces("common")(ConfirmationDialog);
