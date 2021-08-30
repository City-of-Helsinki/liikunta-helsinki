import capitalize from "../capitalize";

describe("capitalize", () => {
  it("should capitalize the first letter", () => {
    expect(capitalize("test")).toEqual("Test");
    expect(capitalize("Test")).toEqual("Test");
    expect(capitalize("1est")).toEqual("1est");
  });
});
