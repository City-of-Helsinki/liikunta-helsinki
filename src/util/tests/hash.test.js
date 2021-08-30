import hash from "../hash";

describe("hash", () => {
  it("Should create a stable hashed value from a string", () => {
    expect(hash("Lorem ipsum dolor sit amet")).toMatchInlineSnapshot(
      `8836320764291090`
    );
  });
});
