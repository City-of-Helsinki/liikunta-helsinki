import { eachDayOfInterval, lightFormat } from "date-fns";

import { Time } from "../../types";

const daysForWeek25Of2021 = eachDayOfInterval({
  start: new Date(2021, 5, 21),
  end: new Date(2021, 5, 27),
});

export const getDate = (date: Date, times: Partial<Time>[]) => ({
  date: lightFormat(date, "yyyy-MM-dd"),
  times,
});

const defaultRenderer = (date: Date, index: number, array: Date[]) =>
  getDate(date, [
    {
      name: "",
      description: "",
      endTimeOnNextDay: false,
      resourceState: "undefined",
      fullDay: false,
      periods: [],
      startTime: "08:00:00",
      endTime: "16:00:00",
    },
  ]);

export function getOpeningHoursForWeek(renderer = defaultRenderer) {
  return daysForWeek25Of2021.map((...args) => renderer(...args));
}
