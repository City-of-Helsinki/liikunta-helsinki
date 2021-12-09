import isWithinInterval from "date-fns/isWithinInterval";
import isAfter from "date-fns/isAfter";
import addYears from "date-fns/addYears";
import subYears from "date-fns/subYears";
import startOfDay from "date-fns/startOfDay";
import endOfDay from "date-fns/endOfDay";

import { summerSeason, winterSeason, Season } from "./seasonConstants";

type SeasonRule = {
  start: {
    day: number;
    month: number;
  };
  end: {
    day: number;
    month: number;
  };
};

function getIsWithinRule(date: Date, seasonRule: SeasonRule): boolean {
  const year = date.getFullYear();

  const start = startOfDay(
    new Date(year, seasonRule.start.month, seasonRule.start.day)
  );
  const end = endOfDay(
    new Date(year, seasonRule.end.month, seasonRule.end.day)
  );

  if (isAfter(start, end)) {
    const isWithinTailingInterval = isWithinInterval(date, {
      start: subYears(start, 1),
      end,
    });
    const isWithinHeadingInterval = isWithinInterval(date, {
      start,
      end: addYears(end, 1),
    });

    // If an interval spans the year change point, the current time may match
    // the "previous" interval's tail or the "next" interval's head.
    return isWithinTailingInterval || isWithinHeadingInterval;
  }

  return isWithinInterval(date, {
    start,
    end,
  });
}

export default function getCurrentSeason() {
  const now = new Date();

  if (getIsWithinRule(now, summerSeason)) {
    return Season.Summer;
  }

  if (getIsWithinRule(now, winterSeason)) {
    return Season.Winter;
  }

  return null;
}
