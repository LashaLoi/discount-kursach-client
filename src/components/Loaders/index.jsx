import React, { memo } from "react";
import ContentLoader from "react-content-loader";

export const BenefitLoader = memo(props => (
    <ContentLoader
        uniquekey={props.id}
        height={156}
        width={400}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        {...props}
    >
        <rect x="70" y="15" rx="4" ry="4" width="117" height="6.4" />
        <rect x="70" y="35" rx="3" ry="3" width="85" height="6.4" />
        <rect x="0" y="80" rx="3" ry="3" width="350" height="6.4" />
        <rect x="0" y="100" rx="3" ry="3" width="380" height="6.4" />
        <rect x="0" y="120" rx="3" ry="3" width="201" height="6.4" />
        <circle cx="30" cy="30" r="30" />
    </ContentLoader>
));

export const DescriptionLongLoader = props => (
    <ContentLoader
        height={215}
        width={400}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        {...props}
    >
        <circle cx="22" cy="20" r="10" />
        <rect x="44" y="10" rx="10" ry="10" width="320" height="20" />
        <rect x="44" y="45" rx="10" ry="10" width="280" height="20" />
        <rect x="44" y="80" rx="10" ry="10" width="320" height="20" />
        <rect x="44" y="115" rx="10" ry="10" width="280" height="20" />
        <rect x="44" y="150" rx="10" ry="10" width="320" height="20" />
    </ContentLoader>
);

export const AboutHeaderLoader = props => (
    <ContentLoader
        height={295}
        width={400}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
        {...props}
    >
        <rect x="0" y="0" rx="10" ry="10" width="400" height="205" />
        <rect x="15" y="215" rx="10" ry="10" width="150" height="20" />
        <rect x="15" y="245" rx="10" ry="10" width="300" height="20" />
    </ContentLoader>
);
