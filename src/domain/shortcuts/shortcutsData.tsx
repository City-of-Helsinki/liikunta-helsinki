import React from "react";

import IconGyms from "../../common/icons/IconGyms";
import IconIceSkating from "../../common/icons/IconIceSkating";
import IconKindergarten from "../../common/icons/IconKindergarten";
import IconOutdoorActivities from "../../common/icons/IconOutdoorActivities";
import IconOutdoorGyms from "../../common/icons/IconOutdoorGyms";
import IconSkiing from "../../common/icons/IconSkiing";
import IconSportsHall from "../../common/icons/IconSportsHall";
import IconSwimming from "../../common/icons/IconSwimming";
import IconSkateboarding from "../../common/icons/IconSkateboarding";
import { Season } from "../season/seasonConstants";

const shortcuts = [
  {
    id: "outdoor_gyms",
    icon: <IconOutdoorGyms />,
    ontologyTreeIds: ["653"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "swimming_summer",
    icon: <IconSwimming />,
    ontologyTreeIds: ["686", "688", "689", "692"],
    seasons: [Season.Summer],
  },
  {
    id: "swimming_winter",
    icon: <IconSwimming />,
    ontologyTreeIds: ["693", "687"],
    seasons: [Season.Winter],
  },
  {
    id: "sports_halls",
    icon: <IconSportsHall />,
    ontologyTreeIds: ["616"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "gyms",
    icon: <IconGyms />,
    ontologyTreeIds: ["611", "613", "2219"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "outdoor_activities",
    icon: <IconOutdoorActivities />,
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
    icon: <IconSkateboarding aria-hidden="true" />,
    ontologyTreeIds: ["652", "620"],
    seasons: [Season.Summer],
  },
  {
    id: "playgrounds",
    icon: <IconKindergarten />,
    ontologyTreeIds: ["648"],
    seasons: [Season.Summer, Season.Winter],
  },
  {
    id: "ice_skating",
    icon: <IconIceSkating />,
    ontologyTreeIds: ["603", "642", "643", "645"],
    seasons: [Season.Winter],
  },
  {
    id: "skiing",
    icon: <IconSkiing />,
    ontologyTreeIds: ["595", "569", "583", "580"],
    seasons: [Season.Winter],
  },
];

export default shortcuts;
