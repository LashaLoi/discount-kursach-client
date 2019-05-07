import React, { memo } from "react";
import { Link } from "react-router-dom";
import { shouldComponentUpdate } from "react-window";
import { Mutation, graphql } from "react-apollo";

import {
  Card,
  CardPrimaryAction,
} from "@rmwc/card";
import { IconButton } from "@rmwc/icon-button";
import { Icon } from "@rmwc/icon";
import { Typography } from "@rmwc/typography";

import { SearchContext } from "../BenefitsList/BenefitsList";
import { FavoritesContext } from "../ListView/ListView";

import { HOVER_BENEFIT, TOGGLE_FAVORITE } from "../../queries/benefits";
import { getCategoryIcon } from "../../constants/categories";
import { GET_USER_FAVORITES } from "../../queries/user";
import { extractUserId } from "../../util/tokenParser";

import "./SideBarBenefit.scss";

const HighlightText = memo(({ name }) => {
  return (
    <SearchContext.Consumer>
      {searchString => {
        const corrName = name || "";
        const startInd = corrName.toLowerCase().search(searchString.trim().toLowerCase());
        const endInd = startInd + searchString.trim().length;
        return (
          <Typography className="benefit-title" use="subtitle1" tag="h2">
            {corrName.substring(0, startInd)}
            <span className="highlighted">
              {corrName.substring(startInd, endInd)}
            </span>
            {corrName.substring(endInd)}
          </Typography>
        );
      }}
    </SearchContext.Consumer>
  );
});

const isNew = createdAt => (Date.parse(createdAt) + 1000 * 60 * 60 * 24 * 7) > Date.now();

class Benefit extends React.Component {
  shouldComponentUpdate = shouldComponentUpdate.bind(this);
  textRef = React.createRef();

  componentWillUnmount() {
    if (this.props.benefit.visible) {
      this.props.mutate({
        variables: {
          id: this.props.benefit.id, hoverState: false,
        },
      });
    }
  }

  render() {
    const {
      benefit: { id, name, categoryName, description, rating, url, discountRange, createdAt },
      mutate,
      style,
      t,
    } = this.props;

    const icon = getCategoryIcon(categoryName).icon;

    const hover = () => mutate({ variables: { id, hoverState: true } });
    const unHover = () => mutate({ variables: { id, hoverState: false } });
    return (
      <div className="outer-container" style={style}>
        <Card
          outlined
          className="sidebar-card"
          id={id}
          onMouseEnter={hover}
          onMouseLeave={unHover}
          onClick={unHover}
        >
          <CardPrimaryAction
            tag={Link}
            to={`/about/${id}`}
          >
            <div className="card-top">
              <div className="avatar">
                <Icon
                  icon={icon}
                  color="lightgray"
                />
                <img alt="" src={url} />
              </div>
              <div className="title-container">
                <HighlightText name={name} createdAt={createdAt} />
                <Typography
                  use="subtitle2"
                  theme="textSecondaryOnBackground"
                  className="rating"
                >
                  <Icon className="accent" icon={{ icon: "star", size: "xsmall" }} />
                  <span>{rating}</span>
                  {!!discountRange && (
                    <>
                      <Icon className="accent" icon={{ icon: "card_giftcard", size: "xsmall" }} />
                      <span>{discountRange}</span>
                    </>
                  )}
                  {isNew(createdAt) && <Icon className="label-new accent" icon={{ icon: "fiber_new", size: "xsmall" }} />}
                </Typography>
              </div>

            </div>
            <Typography ref={this.textRef} className="description" use="caption" tag="p" theme="textSecondaryOnBackground">
              {description}
            </Typography>
          </CardPrimaryAction>

          <FavoritesContext.Consumer>
            {favorites => (
              <Mutation
                mutation={TOGGLE_FAVORITE}
                variables={{ id }}
                refetchQueries={[{ query: GET_USER_FAVORITES, variables: { profileId: extractUserId() } }]}
              >
                {like => (
                  <IconButton
                    icon={{
                      icon: "bookmark_border",
                      size: "small",
                    }}
                    onIcon={{
                      icon: "bookmark",
                      size: "small",
                    }}
                    className="like"
                    onChange={like}
                    checked={favorites.includes(id)}
                    title={t("about:add_to_favorite")}
                  />
                )}
              </Mutation>
            )}
          </FavoritesContext.Consumer>
        </Card>
      </div>
    );
  }
}

const EnhancedBenefit = graphql(HOVER_BENEFIT)(Benefit);

export default EnhancedBenefit;
