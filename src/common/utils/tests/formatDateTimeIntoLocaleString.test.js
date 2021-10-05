import formatDateTimeIntoLocaleString from "../formatDateTimeIntoLocaleString";

describe("formatDateTimeIntoLocaleString", () => {
  it("returns correctly formatted date", () => {
    const date = new Date(2020, 11, 24, 2, 12);

    expect(formatDateTimeIntoLocaleString(date)).toMatchInlineSnapshot(
      `"24.12.2020 02:12"`
    );
  });
});
