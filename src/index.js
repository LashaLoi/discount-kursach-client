import React from "react";
import ReactDOM from "react-dom";
import { I18nextProvider } from "react-i18next";
import { ApolloProvider } from "react-apollo";
import { BrowserRouter } from "react-router-dom";
// import * as serviceWorker from "./serviceWorker";

import App from "./containers/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

import client, { persistor } from "./apollo.config";
import i18n from "./i18n";
import "./common/styles/index.scss";

const root = (
  <ApolloProvider client={client}>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App persistor={persistor} />
        </BrowserRouter>
      </I18nextProvider>
    </ErrorBoundary>
  </ApolloProvider>
);

ReactDOM.render(root, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
