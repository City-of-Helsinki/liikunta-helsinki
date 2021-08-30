import {
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns";
import fi from "date-fns/locale/fi";

import { Item, Event, Keyword, EventOffer } from "../../types";

function getIsCloseInTimeKeyword({ startTime }: Event): Keyword | null {
  const now = new Date();
  const startTimeAsDate = new Date(startTime);
  const isToday = isWithinInterval(startTimeAsDate, {
    start: startOfDay(now),
    end: endOfDay(now),
  });
  const isThisWeek = isWithinInterval(startTimeAsDate, {
    start: startOfWeek(now, { locale: fi }),
    end: endOfWeek(now, { locale: fi }),
  });

  if (!isToday && !isThisWeek) {
    return null;
  }

  const label = isToday ? "Tänään" : isThisWeek ? "Tällä viikolla" : "";

  return {
    label,
    href: "",
  };
}

function getIsFree(event: Event): Keyword | null {
  const isFree = event.offers.find(({ isFree }) => isFree);

  if (!isFree) {
    return null;
  }

  return {
    label: "Maksuton",
    href: "",
    isHighlighted: true,
  };
}

function formatOffer(offer?: EventOffer): string | null {
  if (!offer) {
    return null;
  }

  const { price, description } = offer;

  if (!price && !description) {
    return null;
  }

  return [price, offer.description ? `(${offer.description})` : null]
    .filter((item) => item)
    .join(" ");
}

const formatDateTime = (dateTime: Date): string =>
  format(dateTime, "d.M.yyyy, kk.mm");

function formatEventTime({ startTime, endTime }: Event): string {
  const startTimeDate = new Date(startTime);

  // If there's no end time, return just the start time
  // Example: 12.5.2021, 19.00
  if (!endTime) {
    return formatDateTime(new Date(startTimeDate));
  }

  const endTimeDate = new Date(endTime);

  // If times are within the same day end time hours and minutes as well
  // Example: 12.5.2021, 19.00 – 21.00
  if (isSameDay(startTimeDate, endTimeDate)) {
    return [
      format(startTimeDate, "d.M.yyyy, kk.mm"),
      format(endTimeDate, "kk.mm"),
    ].join(" – ");
  }

  // Otherwise there should be a start time and an end time which point to
  // different calendar dates. In that case, don't show time at all and
  // condense the output by only showing the day of month from start time.
  // Example: 11 – 12.5.2021
  return [format(startTimeDate, "d"), format(endTimeDate, "d.M.yyyy")].join(
    " – "
  );
}

export default function getEventsAsItems(events?: Event[]): Item[] {
  if (!events) {
    return [];
  }

  return events.map((event) => {
    const {
      id,
      name,
      shortDescription,
      images,
      offers: [offer],
    } = event;

    return {
      id,
      title: name,
      pre: formatEventTime(event),
      infoLines: [shortDescription, formatOffer(offer)].filter((item) => item),
      keywords: [getIsCloseInTimeKeyword(event), getIsFree(event)].filter(
        (item) => item
      ),
      href: `https://tapahtumat.hel.fi/fi/events/${id}`,
      image: images?.[0]?.url,
    };
  });
}
