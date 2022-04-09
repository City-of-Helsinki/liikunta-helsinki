import formatToSingleTag from "../formatToSingleTag";

describe("formatToSingleTag", () => {
  it("should format html string to a single tag string with predefined wrapping tag", () => {
    expect(formatToSingleTag(["<p>test</p><p>test2</p>"], "p")).toEqual([
      "<p>test test2</p>",
    ]);
  });
});
