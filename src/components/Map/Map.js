import React, { PureComponent } from "react";
import meanBy from "lodash/meanBy";
import PropTypes from "prop-types";
import { graphql, compose, Query } from "react-apollo";
import GoogleMapReact from "google-map-react";

import Marker from "../Marker/Marker";
import UserMarker from "../UserMarker/UserMarker";

import { UPDATE_CURRENT_CITY } from "../../queries/city";
import { GET_LOCATION } from "../../queries/metadata";
import { GET_MAP_DATA, GET_BENEFIT_MAP_DATA } from "../../queries/benefits";

import { getBenefitsList, getVisibleBenefits } from "../../util/filters";
import { mapStyles } from "../../constants/mapStyles";

import "./Map.scss";

const defaultData = {
  getCity: {
    categories: [],
  },
  getUser: {
    favorites: [],
  },
};

class MapContainer extends PureComponent {
  static propTypes = {
    center: PropTypes.object,
    zoom: PropTypes.number,
    benefits: PropTypes.array,
    hoverBenefit: PropTypes.func,
  };

  parseBenefits = benefits => {
    return benefits.map((benefit) => {
      return benefit.locations.map((location) => ({
        name: benefit.name,
        id: benefit.id,
        locationId: location.id,
        categoryName: benefit.categoryName || benefit.parentCategory.name,
        isHovered: benefit.hovered || location.hovered,
        discountRange: benefit.discountRange,
        rating: benefit.rating,
        lng: location.lng,
        lat: location.lat,
        key: location.id,
      }));
    }).flat();
  }

  getGeometricCenter = locations => {
    const filteredLocations = locations
      .filter(({ lat, lng }) => lat !== 0 && lng !== 0)
      .map(({ lat, lng }) => ({ lat, lng }));
    const center = {
      lat: meanBy(filteredLocations, "lat"),
      lng: meanBy(filteredLocations, "lng"),
    };
    return center;
  }

  render() {
    const {
      center,
      zoom,
      data: { metadata = {} },
      currentCity,
      match,
    } = this.props;
    if (match.params.id) {
      return (
        <div className="map-container">
          <Query query={GET_BENEFIT_MAP_DATA} variables={{ id: match.params.id }}>
            {({
              loading,
              error,
              data,
            }) => {
              const benefit = data.getBenefit ? [data.getBenefit] : [];
              const locations = this.parseBenefits(benefit);
              return (
                <Map
                  locations={locations}
                  isLoading={loading}
                  center={!match.params.id || locations.length === 0 ? center : this.getGeometricCenter(locations)}
                  zoom={locations.length < 2 && locations.length > 0 ? zoom + 2 : zoom}
                  metadata={metadata}
                />
              );
            }}
          </Query>
        </div>
      );
    }
    return (
      <div className="map-container">
        <Query query={GET_MAP_DATA} variables={{ id: currentCity.id }}>
          {({
            loading: getCityLoading,
            error: getCityError,
            data: getCityData,
          }) => {
            const data = Object.keys(getCityData || {}).length ? getCityData : defaultData;
            const isLoading = getCityLoading;

            const benefits = getBenefitsList(data.getCity.categories);
            const visibleBenefits = getVisibleBenefits(benefits, match.params.id);
            const locations = this.parseBenefits(visibleBenefits);
            return (
              <Map
                locations={locations}
                isLoading={isLoading}
                center={center}
                zoom={zoom}
                metadata={metadata}
                clickableMarkers
              />
            );
          }}
        </Query>
      </div>
    );
  }
}

const Map = ({
  locations,
  isLoading,
  center,
  zoom,
  metadata,
  clickableMarkers,
}) => {
  return (
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        language: localStorage.getItem("i18nextLng"),
        region: "by",
      }}
      zoom={zoom}
      center={center}
      options={{
        styles: JSON.parse(mapStyles),
        maxZoom: 30,
        minZoom: 7,
      }}
      yesIWantToUseGoogleMapApiInternals
    >
      {isLoading ? null : locations.map(location => <Marker {...location} clickable={clickableMarkers} />)}
      {metadata && metadata.isLocationAllowed && <UserMarker
        lng={metadata.lng}
        lat={metadata.lat}
      />}
    </GoogleMapReact>
  );
};

export default compose(
  graphql(UPDATE_CURRENT_CITY),
  graphql(GET_LOCATION),
)(MapContainer);
