import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  Interval,
  lightFormat,
} from "date-fns";
import { fi } from "date-fns/locale";
import camelCaseKeys from "camelcase-keys";

import { dataSourceHaukiLogger as logger } from "../../logger";
import { OpeningHour } from "../../../types";
import DataSource from "./DataSource";

type DateInterval = {
  start: Date;
  end: Date;
};

function getOngoingWeekAsInterval(): DateInterval {
  const now = new Date();

  return {
    start: startOfWeek(now, { locale: fi }),
    end: endOfWeek(now, { locale: fi }),
  };
}

function patchMissingDates(
  interval: Interval,
  values?: OpeningHour[],
  defaultValue = null
) {
  if (!values) {
    return values;
  }

  const dates = eachDayOfInterval(interval);

  return dates.map((date) => {
    const value = values.find(
      (value) => value?.date === lightFormat(date, "yyyy-MM-dd")
    );
    const resolvedDefaultValue =
      typeof defaultValue === "function" ? defaultValue(date) : defaultValue;

    return value ?? resolvedDefaultValue;
  });
}

function toCamelCase<I>(obj: I): I {
  return camelCaseKeys<I>(obj, { deep: true });
}

class Hauki extends DataSource {
  /**
   * @param {!string} id
   * @returns {Promise<?Array>} A list of opening hours in Hauki format for the
   * ongoing week, with the exception that dates without opening hours are
   * represented with an object that has an empty times array instead of
   * undefined.
   * @throws {AxiosError}
   */
  async getOpeningHours(id: string): Promise<OpeningHour[] | null> {
    const params = new URLSearchParams();

    const ongoingWeekInterval = getOngoingWeekAsInterval();
    params.append("start_date", ongoingWeekInterval.start.toJSON());
    params.append("end_date", ongoingWeekInterval.end.toJSON());

    const res = await this.get(
      `https://hauki.api.hel.fi/v1/resource/${id}/opening_hours/?${params.toString()}`
    );

    if (res.statusText !== "OK") {
      return null;
    }

    const transformedOpeningHours = toCamelCase<OpeningHour[]>(
      patchMissingDates(ongoingWeekInterval, res?.data, (date: Date) => ({
        date: lightFormat(date, "yyyy-MM-dd"),
        times: [],
      }))
    );

    return transformedOpeningHours ?? null;
  }

  /**
   * @param {!string} id
   * @returns {Promise<?Boolean>} A boolean value that's based on the
   * is_open_now data for the resource. In case data is missing, null may be
   * returned.
   * @throws {AxiosError}
   */
  async getIsOpen(id: string): Promise<boolean | null> {
    const res = await this.get(
      `https://hauki.api.hel.fi/v1/resource/${id}/is_open_now/`
    );

    return res?.data?.is_open ?? null;
  }
}

export default new Hauki(logger);
