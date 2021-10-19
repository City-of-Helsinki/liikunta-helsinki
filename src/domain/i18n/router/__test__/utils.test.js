import { stringifyUrlObject } from "../utils";

describe("i18n router utils", () => {
  describe("stringifyUrlObject", () => {
    it("should correctly stringify url object with search", () => {
      expect(
        stringifyUrlObject({
          pathname: "/venue/[id]/map",
          search: "?isOpenNow=true&q=Swimming%20Pool",
          query: {
            id: "tprek:123",
          },
        })
      ).toMatchInlineSnapshot(
        `"/venue/tprek:123/map?isOpenNow=true&q=Swimming%20Pool"`
      );
    });

    it("should correctly stringify url object with query", () => {
      expect(
        stringifyUrlObject({
          pathname: "/venue/[id]/map",
          query: {
            id: "tprek:123",
            isOpenNow: true,
            q: "Swimming Pool",
          },
        })
      ).toMatchInlineSnapshot(
        `"/venue/tprek:123/map?isOpenNow=true&q=Swimming%20Pool"`
      );
    });
  });
});
