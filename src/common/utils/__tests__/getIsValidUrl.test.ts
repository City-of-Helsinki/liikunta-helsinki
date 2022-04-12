import getIsValidUrl from "../getIsValidUrl";

test.each([
  "http://google.fi",
  "https://google.fi",
  "http://localhost:3000/fi/article-title?param=1",
])("yields true for %p", (url) => {
  expect(getIsValidUrl(url)).toEqual(true);
});

test.each([
  "/",
  "/fi/article-title?param=1",
  "mailto:test@hel.fi",
  "https:|/malformed.fi",
])("yields false for %p", (url) => {
  expect(getIsValidUrl(url)).toEqual(false);
});
