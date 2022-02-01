import {
  getOpeningHoursForWeek,
  getDate,
} from "../../../../tests/getOpeningHours";
import humanizeOpeningHoursForWeek from "../humanizeOpeningHoursForWeek";

describe("humanizeOpeningHoursForWeek", () => {
  it("should return the condensed format when the weekdays have matching opening hours", () => {
    expect(humanizeOpeningHoursForWeek(getOpeningHoursForWeek(), "en"))
      .toMatchInlineSnapshot(`
      "Mo-Fr 08:00 - 16:00
      Sa 08:00 - 16:00
      Su 08:00 - 16:00"
    `);
  });

  it("should return all dates on separate lines when some weekday does not match", () => {
    expect(
      humanizeOpeningHoursForWeek(
        getOpeningHoursForWeek((date, index) => {
          if (index === 2) {
            return getDate(date, [
              {
                startTime: "09:00:00",
                endTime: "16:00:00",
              },
            ]);
          }

          return getDate(date, [
            {
              startTime: "08:00:00",
              endTime: "16:00:00",
            },
          ]);
        }),
        "en"
      )
    ).toMatchInlineSnapshot(`
      "Mo 08:00 - 16:00
      Tu 08:00 - 16:00
      We 09:00 - 16:00
      Th 08:00 - 16:00
      Fr 08:00 - 16:00
      Sa 08:00 - 16:00
      Su 08:00 - 16:00"
    `);
  });

  it("should work with various special cases", () => {
    expect(
      humanizeOpeningHoursForWeek(
        getOpeningHoursForWeek((date, index) => {
          switch (index) {
            case 0:
              // Multiple times
              return getDate(date, [
                {
                  startTime: "09:00:00",
                  endTime: "16:00:00",
                },
                {
                  startTime: "18:00:00",
                  endTime: "19:00:00",
                },
              ]);
            case 1:
              // Time ending the next day
              return getDate(date, [
                {
                  startTime: "09:00:00",
                  endTime: "16:00:00",
                  endTimeOnNextDay: true,
                },
              ]);
            case 2:
              // A full day time with self service resource state
              return getDate(date, [
                {
                  resourceState: "self_service",
                  fullDay: true,
                },
              ]);
            case 3:
              // Times with resource states
              return getDate(date, [
                {
                  startTime: "09:00:00",
                  endTime: "16:00:00",
                  resourceState: "enter_only",
                },
                {
                  startTime: "18:00:00",
                  endTime: "19:00:00",
                  resourceState: "with_key_and_reservation",
                },
              ]);
            case 4:
              // A very complex time
              return getDate(date, [
                {
                  startTime: "09:00:00",
                  endTime: "16:00:00",
                  resourceState: "weather_permitting",
                  endTimeOnNextDay: true,
                },
                {
                  startTime: "12:00:00",
                  endTime: "14:00:00",
                  resourceState: "closed",
                },
                {
                  startTime: "18:00:00",
                  endTime: "22:00:00",
                  resourceState: "with_reservation",
                },
              ]);
            default:
              return getDate(date, [
                {
                  startTime: "08:00:00",
                  endTime: "16:00:00",
                },
              ]);
          }
        }),
        "en"
      )
    ).toMatchInlineSnapshot(`
      "Mo 09:00 - 16:00, 18:00 - 19:00
      Tu 09:00 - 16:00 (On the Next Day)
      We Open All Day (Self Service)
      Th 09:00 - 16:00 (Enter Only), 18:00 - 19:00 (With Key and Reservation)
      Fr 09:00 - 16:00 (On the Next Day) (Weather Permitting), 12:00 - 14:00 (Closed), 18:00 - 22:00 (With Reservation)
      Sa 08:00 - 16:00
      Su 08:00 - 16:00"
    `);
  });

  it("should not return information for dates that don't have any opening times", () => {
    expect(
      humanizeOpeningHoursForWeek(
        getOpeningHoursForWeek((date, index) => {
          if (index === 5 || index === 6) {
            return getDate(date, []);
          }

          return getDate(date, [
            {
              startTime: "08:00:00",
              endTime: "16:00:00",
              resourceState: "open",
            },
          ]);
        }),
        "en"
      )
    ).toMatchInlineSnapshot(`"Mo-Fr 08:00 - 16:00"`);
  });

  it("should work with Swedish", () => {
    expect(
      humanizeOpeningHoursForWeek(
        getOpeningHoursForWeek((date, index) => {
          if (index === 2) {
            return getDate(date, [
              {
                startTime: "09:00:00",
                endTime: "16:00:00",
                fullDay: true,
              },
            ]);
          }

          return getDate(date, [
            {
              startTime: "08:00:00",
              endTime: "16:00:00",
              resourceState: "with_key_and_reservation",
            },
          ]);
        }),
        "sv"
      )
    ).toMatchInlineSnapshot(`
      "må 08:00 - 16:00 (Med nyckel och reservation)
      ti 08:00 - 16:00 (Med nyckel och reservation)
      on Öppet hela dagen
      to 08:00 - 16:00 (Med nyckel och reservation)
      fr 08:00 - 16:00 (Med nyckel och reservation)
      lö 08:00 - 16:00 (Med nyckel och reservation)
      sö 08:00 - 16:00 (Med nyckel och reservation)"
    `);
  });

  it("should work with Finnish", () => {
    expect(
      humanizeOpeningHoursForWeek(
        getOpeningHoursForWeek((date, index) => {
          if (index === 2) {
            return getDate(date, [
              {
                startTime: "09:00:00",
                endTime: "16:00:00",
                fullDay: true,
              },
            ]);
          }

          return getDate(date, [
            {
              startTime: "08:00:00",
              endTime: "16:00:00",
              resourceState: "with_key_and_reservation",
            },
          ]);
        }),
        "fi"
      )
    ).toMatchInlineSnapshot(`
      "ma 08:00 - 16:00 (Avaimella ja varauksella)
      ti 08:00 - 16:00 (Avaimella ja varauksella)
      ke Auki koko päivän
      to 08:00 - 16:00 (Avaimella ja varauksella)
      pe 08:00 - 16:00 (Avaimella ja varauksella)
      la 08:00 - 16:00 (Avaimella ja varauksella)
      su 08:00 - 16:00 (Avaimella ja varauksella)"
    `);
  });
});
