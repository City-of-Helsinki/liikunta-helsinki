import startOfDay from "date-fns/startOfDay";

import { Season } from "../seasonConstants";
import getCurrentSeason from "../getCurrentSeason";

beforeAll(() => {
  jest.useFakeTimers();
});

test("Should return summer when it is the first day of summer season", () => {
  jest.setSystemTime(startOfDay(new Date("2012-05-01")));

  expect(getCurrentSeason()).toBe(Season.Summer);
});

test("Should return summer when it is the last day of summer season", () => {
  jest.setSystemTime(startOfDay(new Date("2012-10-31")));

  expect(getCurrentSeason()).toBe(Season.Summer);
});

test("Should return winter when it is the first day of winter season", () => {
  jest.setSystemTime(startOfDay(new Date("2012-11-01")));

  expect(getCurrentSeason()).toBe(Season.Winter);
});

test("Should return winter when it is the last day of winter season", () => {
  jest.setSystemTime(startOfDay(new Date("2013-04-30")));

  expect(getCurrentSeason()).toBe(Season.Winter);
});

afterAll(() => {
  jest.useRealTimers();
});
