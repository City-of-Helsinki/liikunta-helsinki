import getEventQueryFromCMSEventSearch from "../getEventQueryFromCMSEventSearch";

function getTestUrl(searchParams) {
  return new URL(
    `https://hel.fi?${new URLSearchParams(searchParams).toString()}`
  ).toString();
}

describe("getEventQueryFromCMSEventSearch", () => {
  it("should extract all values", () => {
    const searchParams = {
      q: "some search",
      first: "10",
      administrativeDivisionId: "level_one/123123#helsinki",
    };

    expect(getEventQueryFromCMSEventSearch(getTestUrl(searchParams))).toEqual(
      searchParams
    );
  });

  it("should return super_event_type as camel cased", () => {
    const searchParams = {
      super_event_type: "umbrella",
    };

    expect(getEventQueryFromCMSEventSearch(getTestUrl(searchParams))).toEqual({
      superEventType: "umbrella",
    });
  });
});
