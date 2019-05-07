import React, { lazy, Suspense } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { Query, withApollo } from "react-apollo";

import Splash from "../components/Splash/Splash";

import { SET_LOCATION, GET_LOGIN_STATUS } from "../queries/metadata";
import storeCleaner from "../storeCleaner";
import Logger from "../util/logger";
import { getLocation, getClosestCity } from "../util/location";
import { UPDATE_CURRENT_CITY } from "../queries/city";

import NotFound from "../components/NotFound/NotFound";

const Main = lazy(() => import("./Main"));
const Login = lazy(() => import("../components/Login/Login"));

const PublicRoutes = () => (
  <Switch>
    <Route path="/login" component={Login} />
    <Redirect from="/map" to="/login" />
    <Redirect from="/about/:id" to="/login" />
    <Redirect exact from="/" to="/login" />
    <Route component={NotFound} />
  </Switch>
);

const PrivateRoutes = () => (
  <Switch>
    <Route path={["/map", "/about/:id"]} render={props => <Main {...props} />} />
    <Redirect from="/login" to="/map" />
    <Redirect exact from="/" to="/map" />
    <Route component={NotFound} />
  </Switch>
);

class App extends React.Component {
  state = {
    cacheLoading: true,
  };

  async componentDidMount() {
    await this.props.persistor.restore();
    await storeCleaner();
    this.setState({
      cacheLoading: false,
    });
    this.updateLocation();
  }

  updateLocation = async () => {
    const { client } = this.props;
    try {
      const position = await getLocation();
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      client.mutate({
        mutation: SET_LOCATION,
        variables: { lat, lng, isAllowed: true },
      });
      client.mutate({
        mutation: UPDATE_CURRENT_CITY,
        variables: {
          name: getClosestCity(lat, lng).name,
        },
      });
    } catch (error) {
      client.mutate({
        mutation: SET_LOCATION,
        variables: { isAllowed: false },
      });
      Logger.error(error);
    }
  }

  // eslint-disable-next-line
  render() {
    return (
      <Suspense fallback={<Splash />}>
        <Query skip={this.state.cacheLoading} query={GET_LOGIN_STATUS}>
          {({ data = {}, loading, error }) => {
            if (loading || !data.metadata) {
              return null;
            }
            const isLoggedIn = !!data.metadata.isLoggedIn;
            return isLoggedIn ? <PrivateRoutes /> : <PublicRoutes />;
          }}
        </Query>
      </Suspense>
    );
  }
}

export default withApollo(App);
