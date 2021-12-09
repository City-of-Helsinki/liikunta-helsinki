import React from "react";
import { IconPhoto } from "hds-react";

import { Season } from "../season/seasonConstants";

const shortcuts = [
  {
    id: "outdoor_gyms",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["653"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "swimming_summer",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["686", "688", "689", "692"],
    seasons: [Season.Summer],
  },
  {
    id: "swimming_winter",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["693", "687"],
    seasons: [Season.Winter],
  },
  {
    id: "sports_halls",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["616"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "gyms",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["611", "613", "2219"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "outdoor_activities",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: [
      "697",
      "584",
      "698",
      "712",
      "713",
      "590",
      "702",
      "714",
      "704",
      "715",
      "591",
      "716",
    ],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "skating",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["652", "620"],
    seasons: [Season.Summer],
  },
  {
    id: "playgrounds",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["648"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "ice_skating",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["603", "642", "643", "645"],
    seasons: [Season.Winter],
  },
  {
    id: "skiing",
    icon: <IconPhoto aria-hidden="true" />,
    ontologyTreeIds: ["595", "569", "583", "580"],
    seasons: [Season.Winter],
  },
];

export default shortcuts;
