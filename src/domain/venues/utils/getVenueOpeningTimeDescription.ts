import format from "date-fns/format";
import isBefore from "date-fns/isBefore";
import isAfter from "date-fns/isAfter";
import isFuture from "date-fns/isFuture";
import differenceInMilliseconds from "date-fns/differenceInMilliseconds";

import { OpeningHour, Time } from "../../../types";
import { Locale } from "../../../types";
import { humanizeTimeResourceState } from "../../../common/utils/time/humanizeOpeningHoursForWeek";

function createDate(baseDate: Date, time: string) {
  const [hours, minutes, seconds] = time.split(":");

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    Number(hours),
    Number(minutes),
    Number(seconds)
  );
}

function getInterval(time: Time, baseDate: Date) {
  return {
    start: createDate(baseDate, time.endTime),
    end: createDate(baseDate, time.startTime),
  };
}

function getCurrentTime(times: Time[]) {
  const now = new Date();

  return times.find((time) => {
    const startTime = createDate(now, time.startTime);
    const endTime = createDate(now, time.endTime);

    return (
      time.resourceState !== "closed" &&
      isAfter(now, startTime) &&
      isBefore(now, endTime)
    );
  });
}

function getNextOpeningHoursFromNow(openingHours: OpeningHour[]): Time | null {
  const now = new Date();
  const todayDate = format(new Date(), "yyyy-MM-dd");

  const openingHoursToday = openingHours.find(
    (openingHour) => openingHour.date === todayDate
  );
  const nextTimeToday = openingHoursToday?.times?.reduce((incumbent, time) => {
    const { start, end } = getInterval(time, now);

    // Ignore times that are not in the future.
    // Ignore times that stand for closed state.
    if (isFuture(end) && time.resourceState !== "closed") {
      // If there's no incumbent, use the first compatible time.
      if (!incumbent) {
        return time;
      }

      const differenceToNow = differenceInMilliseconds(start, now);
      const incumbentDifferenceToNow = differenceInMilliseconds(
        createDate(now, incumbent?.startTime),
        now
      );

      // Replace incumbent if current time is closer to now than the incumbent.
      if (differenceToNow < incumbentDifferenceToNow) {
        return time;
      }
    }

    return incumbent;
  }, null);

  if (nextTimeToday) {
    return nextTimeToday;
  }

  // Find the first next time from some future date
  const nextOpeningHoursOtherDays = openingHours.find(
    (date) =>
      // Is in future
      isFuture(new Date(date.date)) &&
      // Has times
      date.times.length > 0 &&
      // Has times that don't stand in for closed
      date.times.some((time) => time.resourceState !== "closed")
  );
  const nextTimeOtherDays = nextOpeningHoursOtherDays?.times?.filter(
    // Ignore closed times
    (time) => time.resourceState !== "closed"
    // and pick first time
  )?.[0];

  if (nextTimeOtherDays) {
    return nextTimeOtherDays;
  }

  return null;
}

function formatTime(time: Time, locale: Locale) {
  const startParts = time.startTime.split(":");
  const endParts = time.endTime.split(":");
  const humanizedResourceState = humanizeTimeResourceState(
    time.resourceState,
    locale
  );
  const humanizedResourceStateString = humanizedResourceState
    ? ` (${humanizedResourceState})`
    : "";

  return {
    start: `${startParts[0]}:${startParts[1]}${humanizedResourceStateString}`,
    end: `${endParts[0]}:${endParts[1]}${humanizedResourceStateString}`,
  };
}

type OpeningHoursDescriptor = {
  isOpenNow: boolean;
  nextOpeningTime: Time | null;
  closingTime: Time | null;
};

function getVenueOpeningTimeDescriptor(
  openingHours: OpeningHour[]
): OpeningHoursDescriptor {
  const todayDate = format(new Date(), "yyyy-MM-dd");

  const openingHoursToday = openingHours.find(
    (openingHour) => openingHour.date === todayDate
  );
  const timeMatchingNow = openingHoursToday
    ? getCurrentTime(openingHoursToday.times)
    : null;
  const isOpenNow = !!timeMatchingNow;
  const nextOpeningHours = getNextOpeningHoursFromNow(openingHours);

  return {
    isOpenNow,
    closingTime: timeMatchingNow,
    nextOpeningTime: nextOpeningHours,
  };
}

type HumanizeOpeningHoursDescriptorCopy = {
  openNowAndCloses: string;
  closedNowAndOpens: string;
};

function humanizeOpeningHoursDescriptor(
  { isOpenNow, closingTime, nextOpeningTime }: OpeningHoursDescriptor,
  locale: Locale,
  { openNowAndCloses, closedNowAndOpens }: HumanizeOpeningHoursDescriptorCopy
) {
  if (isOpenNow) {
    return `${openNowAndCloses} ${formatTime(closingTime, locale).end}`;
  } else if (nextOpeningTime) {
    return `${closedNowAndOpens} ${formatTime(nextOpeningTime, locale).start}`;
  }

  return null;
}

export default function getVenueOpeningTimeDescription(
  openingHours: OpeningHour[],
  locale: Locale,
  t: (translationKey: string) => string
) {
  return humanizeOpeningHoursDescriptor(
    getVenueOpeningTimeDescriptor(openingHours),
    locale,
    {
      openNowAndCloses: t("utils:open_now_and_closes"),
      closedNowAndOpens: t("utils:closed_now_and_opens"),
    }
  );
}
