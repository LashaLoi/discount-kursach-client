import React, { Component } from "react";
import _ from "lodash";
import { Route, Switch } from "react-router-dom";

import ListView from "../ListView/ListView";
import AboutView from "../AboutView/AboutView";
import ConfirmationDialog from "../ConfirmationDialog";

import "./Sidebar.scss";
import { withNamespaces } from "react-i18next";
import { compose, graphql } from "react-apollo";
import { UPDATE_CURRENT_CITY } from "../../queries/city";

class Sidebar extends Component {
  state = {
    scrollOffset: 0,
    showCityPicker: false,
  };

  handleScroll = scroll => {
    this.setState({ scrollOffset: scroll.scrollOffset });
  }

  throttledScrollHandler = _.throttle(this.handleScroll, 500, { leading: false });

  handleCityPickerAccept = id => {
    this.props.mutate({
      variables: { id },
    });
  };

  handlePickerToggle = show => () => {
    this.setState({
      showCityPicker: show,
    });
  };

  render() {
    const {
      currentCity,
      cities,
      t,
    } = this.props;
    return (
      <aside className="drawer">
        <Switch>
          <Route path="/map" render={
            () => {
              return (
                <ListView
                  scrollOffset={this.state.scrollOffset}
                  onScroll={this.throttledScrollHandler}
                  currentCity={currentCity}
                  onCityPickerOpen={this.handlePickerToggle(true)}
                />
              );
            }
          } />
          <Route path="/about/:id" render={
            (props) => {
              return (
                <AboutView {...props} />
              );
            }
          } />
        </Switch>
        <ConfirmationDialog
          collection={cities.map(city => ({ key: city.id, value: t(`cities.${city.name}`) } ))}
          defautlSelectedKey={currentCity.id}
          title="pick_your_city"
          open={this.state.showCityPicker}
          onClose={this.handlePickerToggle(false)}
          onAccept={this.handleCityPickerAccept}
          cancellable
        />
      </aside>
    );
  }
}

export default compose(
  graphql(UPDATE_CURRENT_CITY),
  withNamespaces("common")
)(Sidebar);
