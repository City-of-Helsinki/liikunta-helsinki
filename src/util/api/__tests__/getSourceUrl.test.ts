import getSourceUrl from "../getSourceUrl";

it("It returns correct url based on source", () => {
  const linkedURL = getSourceUrl("linked", "61903");
  const tprekURL = getSourceUrl("tprek", "61903");
  const defaultURL = getSourceUrl("asd", "61903");

  expect(linkedURL).toEqual(
    "https://api.hel.fi/linkedevents/v1/place/tprek:61903/"
  );
  expect(tprekURL).toEqual(
    "https://www.hel.fi/palvelukarttaws/rest/v4/unit/61903/"
  );
  expect(defaultURL).toEqual(
    "https://www.hel.fi/palvelukarttaws/rest/v4/unit/61903/"
  );
});
