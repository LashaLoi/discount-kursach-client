import gql from "graphql-tag";

export const GET_SIDEBAR_DATA = gql`
  query($id: ID!) {
    getCity(id: $id) {
      id
      categories {
        id
        name
        benefits {
          createdAt
          url
          visible @client
          hovered @client
          discountRange @client
          highestDiscount @client
          rating
          name
          description
          working
          id
          discount
        }
      }
    }
  }
`;

export const GET_MAP_DATA = gql`
  query($id: ID!) {
    getCity(id: $id) {
      id
      categories {
        id
        name
        benefits {
          visible @client
          hovered @client
          discountRange @client
          rating
          name
          description
          id
          discount
          parentCategory {
            id
            name
          }
          locations {
            hovered @client
            lat
            lng
            id
          }
        }
      }
    }
  }
`;

export const GET_BENEFIT_RATING = gql`
  query($id: ID!) {
    getBenefit(id: $id) {
      id
      rating
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation($id: ID!) {
    toggleFavorite(id: $id)
  }
`;

export const GET_BENEFIT_BY_ID = gql`
  query getBenefitById ($id: ID!) {
    getBenefit(id: $id) {
      url
      visible @client
      hovered @client
      discountRange @client
      userRating @client
      rating
      link
      name
      phone
      description
      working
      id
      discount
      parentCategory {
        id
        name
      }
      locations {
        address
        lat
        lng
        id
      }
    }
  }
`;

export const GET_BENEFIT_MAP_DATA = gql`
  query getBenefitById ($id: ID!) {
    getBenefit(id: $id) {
      visible @client
      hovered @client
      discountRange @client
      rating
      name
      description
      id
      discount
      parentCategory {
        id
        name
        # parentCity {
        #   id
        #   name
        #   lat @client
        #   lng @client
        #   zoom @client
        #   current @client
        # }
      }
      locations {
        address
        lat
        lng
        id
      }
    }
  }
`;

export const GET_BENEFIT_COMMENTS = gql`
  query getBenefitComments ($id: ID!) {
    getBenefit(id: $id) {
      id
      userRating @client
      comments {
        id
        userId
        firstName
        lastName
        created
        message
        rating
        votes {
          id
          userId
        }
      }
    }
  }
`;

export const GET_COMMENT = gql`
  query getComment($id: ID!) {
    getComment(id: $id) {
      id
      votes {
        id
        userId
      }
    }
  }
`;

export const GET_BENEFIT_TO_HOVER = gql`
  fragment hoverBenefit on Benefit {
      visible @client
      hovered @client
      name
  }
`;

export const GET_LOCATION_TO_HOVER = gql`
  fragment hoverLocation on Location {
      hovered @client
  }
`;

export const GET_BENEFIT_TO_RATE = gql`
  fragment rateBenefit on Benefit {
      rating
      id
  }
`;

export const HOVER_BENEFIT = gql`
  mutation hoverBenefit($id: ID!, $hoverState: Boolean) {
    hoverBenefit(id: $id, hoverState: $hoverState) @client
  }
`;

export const HOVER_LOCATION = gql`
  mutation hoverLocation($id: ID!, $hoverState: Boolean) {
    hoverLocation(id: $id, hoverState: $hoverState) @client
  }
`;

export const RATE_BENEFIT = gql`
  mutation rateBenefit($id: ID!, $stars: Float!) {
    setRaiting(count: $stars, id: $id)
  }
`;

export const RATE_COMMENT = gql`
  mutation setVote($commentId: ID!) {
    setVote(commentId: $commentId)
  }
`;

export const CREATE_COMMENT = gql`
    mutation setComment($message: String!, $benefit: ID!, $rating: Int!) {
      setComment(benefit: $benefit, message: $message, rating: $rating)
    }
`;

export const DELETE_COMMENT = gql`
    mutation deleteComment($id: ID!) {
      deleteComment(id: $id)
    }
`;

export const ASK_THE_QUESTION = gql`
  mutation callHR($message: String!, $userEmail: String!, $benefitId: ID) {
   callHR(message: $message, userEmail: $userEmail, benefitId: $benefitId)
  }
`;

export const COMMENT_SET = gql`
  subscription commentSet($benefitId: ID!) {
    commentSet(benefitId: $benefitId) {
      id
      userId
      firstName
      lastName
      created
      message
      rating
      votes {
        id
        userId
        commentId
      }
    }
  }
`;

export const COMMENT_DELETED = gql`
  subscription commentDeleted($benefitId: ID!) {
    commentDeleted(benefitId: $benefitId) {
      id
      userId
    }
  }
`;

export const VOTE_SET = gql`
  subscription voteSet($benefitId: ID!) {
    voteSet(benefitId: $benefitId) {
      id
      userId
      commentId
    }
  }
`;

export const RATING_SET = gql`
  subscription ratingSet($benefitId: ID!) {
    ratingSet(benefitId: $benefitId)
  }
`;
