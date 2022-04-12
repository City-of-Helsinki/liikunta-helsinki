import AppConfig from "../../../domain/app/AppConfig";
import getIsHrefExternal from "../getIsHrefExternal";

const mockOrigin = "http://localhost:3000";

beforeEach(() => {
  jest.spyOn(AppConfig, "origin", "get").mockReturnValue(mockOrigin);
});

test.each([
  "http://localhost:3001",
  "https://localhost:3000",
  "https://hel.fi",
])("%p is external", (url) => {
  expect(getIsHrefExternal(url)).toEqual(true);
});

test.each([
  "http://localhost:3000/fi/path",
  "/fi/path",
  "weirdProtocol://localhost:3000/fi/path",
  "https:|/domain.fi/fi/article-title",
])("%p is not external", (url) => {
  expect(getIsHrefExternal(url)).toEqual(false);
});
