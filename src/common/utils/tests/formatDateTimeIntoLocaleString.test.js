import formatDateTimeIntoLocaleString from "../formatDateTimeIntoLocaleString";

describe("formatDateTimeIntoLocaleString", () => {
  it("returns correctly formatted date", () => {
    const date = new Date(2020, 11, 24, 12, 12);

    expect(formatDateTimeIntoLocaleString(date, "fi")).toMatchInlineSnapshot(
      `"24.12.2020 klo 12.12"`
    );
    expect(formatDateTimeIntoLocaleString(date, "sv")).toMatchInlineSnapshot(
      `"2020-12-24 12:12"`
    );
    expect(formatDateTimeIntoLocaleString(date, "en")).toMatchInlineSnapshot(
      `"12/24/2020, 12:12 PM"`
    );
  });
});
