import React, { memo } from "react";
import PropTypes from "prop-types";
import { Mutation } from "react-apollo";
import { Link } from "react-router-dom";

// import Tooltip from "@material-ui/core/Tooltip";
import Tooltip from "../Tooltip/Tooltip";
import { Icon } from "@rmwc/icon";

import { HOVER_LOCATION } from "../../queries/benefits";
import { getCategoryIcon } from "../../constants/categories";

import "./Marker.scss";

const Marker = ({
  name,
  discountRange,
  categoryName,
  isHovered,
  id,
  locationId,
  rating,
}) => {
  return (
    <Mutation mutation={HOVER_LOCATION}>
      {hoverLocation => (
          <Tooltip
            title={name}
            discountRange={discountRange}
            rating={rating}
            show={isHovered}
          >
            <Link
              to={`/about/${id}`}
              onMouseEnter={() => hoverLocation({ variables: { id: locationId, hoverState: true } })}
              onMouseLeave={() => hoverLocation({ variables: { id: locationId, hoverState: false } })}
              onClick={() => hoverLocation({ variables: { id: locationId, hoverState: false } })}
              className={`marker center ${isHovered && "hovered"}`}
            >
                <Icon icon={getCategoryIcon(categoryName).icon} />
            </Link>
          </Tooltip>
      )}
    </Mutation>
  );
};

Marker.propTypes = {
  name: PropTypes.string,
  discount: PropTypes.string,
  categoryName: PropTypes.string,
  hoverable: PropTypes.bool,
  isHovered: PropTypes.bool,
  id: PropTypes.string.isRequired,
  lat: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  lng: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default memo(Marker);
