import { Locale as DateLocale } from "date-fns";
import format from "date-fns/format";
import fi from "date-fns/locale/fi";
import sv from "date-fns/locale/sv";
import enGB from "date-fns/locale/en-GB";

import { Locale } from "../../config";
import { OpeningHour, Time, TimeResourceState } from "../../types";

type Copy = {
  closed: string;
  selfService: string;
  withKey: string;
  withReservation: string;
  openAndReservable: string;
  withKeyAndReservation: string;
  enterOnly: string;
  exitOnly: string;
  weatherPermitting: string;
  openFullDay: string;
  onNextDay: string;
};

type MicroCopy = {
  [key: string]: Copy;
};

const microCopy: MicroCopy = {
  fi: {
    closed: "Suljettu",
    selfService: "Itsepalvelu",
    withKey: "Avaimella",
    withReservation: "Varauksella",
    openAndReservable: "Avoinna ja varattavissa",
    withKeyAndReservation: "Avaimella ja varauksella",
    enterOnly: "Vai sisäänpääsy",
    exitOnly: "Vain ulospääsy",
    weatherPermitting: "Sään salliessa",
    openFullDay: "Auki koko päivän",
    onNextDay: "Seuraavana päivänä",
  },
  sv: {
    closed: "Stängd",
    selfService: "Självbetjäning",
    withKey: "Med nyckel",
    withReservation: "Med reservation",
    openAndReservable: "Öppet och reserverbart",
    withKeyAndReservation: "Med nyckel och reservation",
    enterOnly: "Ange bara",
    exitOnly: "Endast utgång",
    weatherPermitting: "Vädret tillåter",
    openFullDay: "Öppet hela dagen",
    onNextDay: "Nästa dag",
  },
  en: {
    closed: "Closed",
    selfService: "Self Service",
    withKey: "With Key",
    withReservation: "With Reservation",
    openAndReservable: "Open and Reservable",
    withKeyAndReservation: "With Key and Reservation",
    enterOnly: "Enter Only",
    exitOnly: "Exit Only",
    weatherPermitting: "Weather Permitting",
    openFullDay: "Open All Day",
    onNextDay: "On the Next Day",
  },
};

const dateLocales = {
  fi,
  sv,
  en: enGB,
};

function getIfArraysMatch<T = Record<string, unknown>>(
  arrays: Array<T[]>
): T[] | null {
  const values = {};

  arrays.forEach((array) => {
    values[JSON.stringify(array)] = "seen";
  });

  if (Object.keys(values).length === 1) {
    return JSON.parse(Object.keys(values)[0]);
  }

  return null;
}

function formatTime(time?: string) {
  if (!time) {
    return time;
  }

  const [hours, minutes] = time.split(":");

  return [hours, minutes].join(":");
}

function humanizeTimeResourceState(
  resourceState: TimeResourceState,
  copy = microCopy.fi
): string {
  switch (resourceState) {
    case "closed":
      return copy.closed;
    case "self_service":
      return copy.selfService;
    case "with_key":
      return copy.withKey;
    case "with_reservation":
      return copy.withReservation;
    case "open_and_reservable":
      return copy.openAndReservable;
    case "with_key_and_reservation":
      return copy.withKeyAndReservation;
    case "enter_only":
      return copy.enterOnly;
    case "exit_only":
      return copy.exitOnly;
    case "weather_permitting":
      return copy.weatherPermitting;
    case "open":
    case "undefined":
    default:
      return "";
  }
}

function humanizeTimeEndTime(time: Time, copy = microCopy.fi): string {
  const endTimeFormatted = formatTime(time.endTime);

  if (time.endTimeOnNextDay) {
    return `${endTimeFormatted} (${copy.onNextDay})`;
  }

  return endTimeFormatted;
}

function humanizeTime(time: Time, copy = microCopy.fi): string {
  const interval = `${formatTime(time.startTime)} - ${humanizeTimeEndTime(
    time,
    copy
  )}`;
  const humanizedResourceState = humanizeTimeResourceState(
    time.resourceState,
    copy
  );

  if (time.fullDay && humanizedResourceState) {
    return `${copy.openFullDay} (${humanizedResourceState})`;
  }

  if (time.fullDay) {
    return copy.openFullDay;
  }

  if (humanizedResourceState) {
    return `${interval} (${humanizedResourceState})`;
  }

  return interval;
}

function humanizeTimes(times: Time[], copy = microCopy.fi): string {
  if (times.length === 0) {
    return copy.closed;
  }

  return times.map((time) => humanizeTime(time, copy)).join(", ");
}

function getDayOfWeekName(dateTime: string, locale: DateLocale = fi): string {
  return format(new Date(dateTime), "EEEEEE", { locale });
}

function humanizeOpeningHour(
  openingHour: OpeningHour,
  locale: Locale = "fi"
): string | null {
  if (openingHour?.times.length === 0) {
    return null;
  }

  const dayOfWeekName = getDayOfWeekName(
    openingHour?.date,
    dateLocales[locale]
  );
  const times = humanizeTimes(openingHour?.times, microCopy[locale]);

  return `${dayOfWeekName} ${times}`;
}

function renderOpeningHours(openingHours: Array<string | null>): string {
  return openingHours
    .filter((item): item is string => item !== null)
    .join("\n");
}

/**
 * Takes in opening hours in Hauki-format with the exception that dates without
 * opening hours are expected to be represented with an object that has an empty
 * times array. Attempts to return a string that's human friendly.
 *
 * When opening hours match during the weekdays (Monday through Friday), they
 * are grouped. E.g.
 *
 * Mon-Fri 08:00-16:00
 * Sat 08:00-16:00
 * Sun 08:00-16:00
 *
 * If some dates do not match, opening hours are shown in the default format
 *
 * Mon 08:00-16:00
 * Tue 08:00-16:00 (With key)
 * Wed Closed
 * Thu 08:00-16:00
 * Fri 08:00-16:00 (Exit only)
 * Sat 08:00-16:00
 * Sun 08:00-16:00
 *
 * @param {Array} openingHours
 * @returns {string}
 */
function humanizeOpeningHoursForWeek(
  openingHours?: OpeningHour[],
  locale: Locale = "fi"
): string {
  if (!openingHours) {
    return null;
  }

  const [mon, tue, wed, thu, fri, sat, sun] = openingHours;

  const weekdays = [mon, tue, wed, thu, fri];
  const matchingTimes = getIfArraysMatch<Time>(
    weekdays.map((weekday) => weekday.times)
  );

  if (matchingTimes) {
    const commonTimes = humanizeTimes(matchingTimes, microCopy[locale]);
    const weekendOpeningHours = [sat, sun].map((weekendOpeningHour) =>
      humanizeOpeningHour(weekendOpeningHour, locale)
    );
    const formattedOpeningHours = [
      `${getDayOfWeekName(mon.date, dateLocales[locale])}-${getDayOfWeekName(
        fri.date,
        dateLocales[locale]
      )} ${commonTimes}`,
      ...weekendOpeningHours,
    ];

    return renderOpeningHours(formattedOpeningHours);
  }

  return renderOpeningHours(
    openingHours.map((openingHour) => humanizeOpeningHour(openingHour, locale))
  );
}

export default humanizeOpeningHoursForWeek;
