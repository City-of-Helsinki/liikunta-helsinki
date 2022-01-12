import startOfDay from "date-fns/startOfDay";

import { Time, OpeningHour } from "../../../../types";
import getVenueOpeningTimeDescriptor from "../getVenueOpeningTimeDescriptor";

function buildDateDocument(date: string, times: Partial<Time>[]): OpeningHour {
  return {
    date,
    times: times.map((time) => ({
      startTime: "08:00:00",
      endTime: "16:00:00",
      name: "",
      description: "",
      endTimeOnNextDay: false,
      resourceState: "open",
      fullDay: false,
      periods: [],
      ...time,
    })),
  };
}

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(startOfDay(new Date("2012-05-01")));
});

afterAll(() => {
  jest.useRealTimers();
});

test("returns null when times can not be found", () => {
  expect(getVenueOpeningTimeDescriptor([], "fi")).toEqual(null);
});

test("renders correct result when venue is closed", () => {
  // will be open today
  expect(
    getVenueOpeningTimeDescriptor(
      [
        buildDateDocument("2012-05-01", [
          {
            startTime: "08:00:00",
            endTime: "16:00:00",
          },
        ]),
      ],
      "fi"
    )
  ).toMatchInlineSnapshot(`"Kiinni tällä hetkellä, aukeaa 08:00"`);
  // will be open day after tomorrow
  expect(
    getVenueOpeningTimeDescriptor(
      [
        buildDateDocument("2012-05-03", [
          {
            startTime: "07:00:00",
            endTime: "16:00:00",
          },
        ]),
        buildDateDocument("2012-05-04", [
          {
            startTime: "10:00:00",
            endTime: "16:00:00",
          },
        ]),
      ],
      "fi"
    )
  ).toMatchInlineSnapshot(`"Kiinni tällä hetkellä, aukeaa 07:00"`);
});

test("renders correct result when venue is open", () => {
  jest.setSystemTime(new Date(2012, 4, 1, 12, 0, 0, 0));

  expect(
    getVenueOpeningTimeDescriptor(
      [
        buildDateDocument("2012-05-01", [
          {
            startTime: "07:00:00",
            endTime: "23:00:00",
          },
        ]),
      ],
      "fi"
    )
  ).toMatchInlineSnapshot(`"Auki tällä hetkellä, sulkeutuu 23:00"`);
});

test("renders resource state", () => {
  expect(
    getVenueOpeningTimeDescriptor(
      [
        buildDateDocument("2012-05-01", [
          {
            startTime: "08:00:00",
            endTime: "16:00:00",
            resourceState: "weather_permitting",
          },
        ]),
      ],
      "fi"
    )
  ).toMatchInlineSnapshot(
    `"Kiinni tällä hetkellä, aukeaa 08:00 (Sään salliessa)"`
  );
});

test("ignores closed times", () => {
  expect(
    getVenueOpeningTimeDescriptor(
      [
        buildDateDocument("2012-05-01", [
          {
            startTime: "08:00:00",
            endTime: "16:00:00",
            resourceState: "closed",
          },
        ]),
      ],
      "fi"
    )
  ).toEqual(null);
});
