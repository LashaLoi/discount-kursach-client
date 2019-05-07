import React, { memo } from "react";
import { Query } from "react-apollo";

import { GET_ALL_CITIES } from "../queries/city";
import { getCurrentCity } from "../util/filters";

import Sidebar from "../components/Sidebar/SideBar";
import Map from "../components/Map/Map";

const Main = ({ match }) => {
    return (
        <div className="main-content">
            <Query query={GET_ALL_CITIES}>
                {({ data: { getCities }, loading: getCitiesLoading, error }) => {
                    if (getCitiesLoading || !getCities) {
                        return null;
                    }
                    const currentCity = getCurrentCity(getCities) || getCities[0];
                    return (
                        <>
                            <Sidebar cities={getCities} currentCity={currentCity} />
                            <Map
                                center={{
                                    lat: currentCity.lat,
                                    lng: currentCity.lng,
                                }}
                                zoom={currentCity.zoom}
                                currentCity={currentCity}
                                match={match}
                            />
                        </>
                    );
                }}
            </Query>
        </div>
    );
};

export default memo(Main);
