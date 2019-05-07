import React, { Component } from "react";
import { withNamespaces } from "react-i18next";
import { Mutation, Query } from "react-apollo";

import { Button } from "@rmwc/button";
import { TextField } from "@rmwc/textfield";
import { CircularProgress } from "@rmwc/circular-progress";
import { Typography } from "@rmwc/typography";
import { Elevation } from "@rmwc/elevation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogButton,
} from "@rmwc/dialog";

import { LOGIN, GET_LOGIN_STATUS } from "../../queries/metadata";
import { updateAfterLogin } from "../../resolvers/metadata";
import { Logo, AppStore, GooglePlay } from "../Icons";
import { mobileCheck } from "../../util/userAgent";

import "./Login.scss";

class Login extends Component {
  state = {
    login: process.env.NODE_ENV === "development" ? (process.env.DEFAULT_LOGIN || "") : "",
    password: process.env.NODE_ENV === "development" ? (process.env.DEFAULT_PASS || "") : "",
    showDialog: mobileCheck(),
  };

  handleDialogClose = () => {
    this.setState({
      showDialog: false,
    });
  };

  handleChange = event => {
    const {
      target: { name, value },
    } = event;

    this.setState({ [name]: value });
  };

  handleKeyPress = (event, handler) => {
    if (event.key === "Enter") {
      handler({
        variables: {
          login: this.state.login,
          password: this.state.password,
        },
        update: updateAfterLogin,
      });
    }
  }

  render() {
    const {
      state: { login, password },
      props: { t },
      handleChange,
    } = this;

    return (
      <div className="login">
        <Elevation z={2} className="form-container">
          <div className="headline">
            <Logo className="logo" />
            <h1 className="mdc-typography--headline4">{t("common:app_short_name")}</h1>
          </div>
          <p className="mdc-typography--caption">{t("callToLogIn")}</p>
          <Mutation mutation={LOGIN}>
            {(handleLogin, { loading: loginLoading }) => (
              <>
                <TextField
                  onKeyPress={event => this.handleKeyPress(event, handleLogin)}
                  onChange={handleChange}
                  value={login}
                  disabled={loginLoading}
                  outlined
                  name="login"
                  label={t("username")}
                  className="form-textfield"
                  icon="account_circle"
                />
                <TextField
                  onKeyPress={event => this.handleKeyPress(event, handleLogin)}
                  onChange={handleChange}
                  value={password}
                  disabled={loginLoading}
                  outlined
                  name="password"
                  type="password"
                  label={t("password")}
                  className="form-textfield"
                  icon="lock"
                />
                <Button
                  onClick={() => handleLogin({
                    variables: { login, password },
                    update: updateAfterLogin,
                  })}
                  unelevated
                  className="form-button"
                  disabled={loginLoading}
                >
                  {loginLoading ? <CircularProgress /> : t("signIn")}
                </Button>
                <Query query={GET_LOGIN_STATUS}>
                  {({ data, loading, error }) => {
                    if (loading || error) {
                      return null;
                    }
                    return (
                      <Typography use="caption" className="error-msg">
                        {t(data.metadata.authErrorMessage)}
                      </Typography>
                    );
                  }}
                </Query>
              </>
            )}
          </Mutation>
        </Elevation>
        <div className="mobile-downloads">
          <a
            href={process.env.REACT_APP_IOS_LINK}
            className="icon"
          >
            <AppStore height={40} />
          </a>
          <a
            href={process.env.REACT_APP_GOOGLE_PLAY_LINK}
            className="icon"
          >
            <GooglePlay height={40} />
          </a>
        </div>
        <Dialog
          open={this.state.showDialog}
          onClose={this.handleDialogClose}
        >
          <DialogTitle>{t("discounts_mobile")}</DialogTitle>
          <DialogContent>{t("discounts_mobile_hint")}</DialogContent>
          <DialogActions>
            <DialogButton
              action="close"
              theme="secondary"
              ripple={{ accent: true }} 
            >
              {t("no_thanks")}
            </DialogButton>
            <DialogButton
              tag="a"
              href={process.env.REACT_APP_MOBILE_LINK}
              action="accept"
              theme="secondary"
              ripple={{ accent: true }} 
              isDefaultAction
            >
              {t("download")}
            </DialogButton>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withNamespaces("login")(Login);
