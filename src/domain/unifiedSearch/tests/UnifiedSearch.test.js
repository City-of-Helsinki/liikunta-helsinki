import queryString from "query-string";

import { UnifiedSearch } from "../useUnifiedSearch";

class MockQueryPersister {
  persistQuery() {
    // pass
  }

  readPersistedQuery() {
    // pass
  }
}

function getUnifiedSearch(router) {
  return new UnifiedSearch(router, new MockQueryPersister());
}

function getAsPath(values) {
  return `/search?${queryString.stringify(values)}`;
}

describe("UnifiedSearch", () => {
  describe("get filters", () => {
    it("filters should return expected values", () => {
      expect(
        getUnifiedSearch({
          asPath: getAsPath({
            q: ["swimming", "aurinkolahti"],
            first: 10,
            after: "cursor",
          }),
        }).filters
      ).toMatchInlineSnapshot(`
              Object {
                "after": "cursor",
                "first": 10,
                "q": Array [
                  "swimming",
                  "aurinkolahti",
                ],
              }
          `);
    });
  });

  describe("get filterList", () => {
    it("should return a filter value list", () => {
      const unifiedSearch = getUnifiedSearch({
        asPath: getAsPath({
          q: ["A", "B"],
          administrativeDivisionIds: ["123"],
        }),
      });

      expect(unifiedSearch.filterList).toMatchInlineSnapshot(`
        Array [
          Object {
            "key": "q",
            "value": "A",
          },
          Object {
            "key": "q",
            "value": "B",
          },
          Object {
            "key": "administrativeDivisionIds",
            "value": "123",
          },
        ]
      `);
    });
  });

  describe("setFilters", () => {
    it("should set filters with expected values", () => {
      const mockRouter = {
        asPath: getAsPath({
          q: ["B"],
        }),
        replace: jest.fn(),
      };
      const unifiedSearch = getUnifiedSearch(mockRouter);

      unifiedSearch.setFilters({
        q: ["B"],
      });

      expect(mockRouter.replace).toHaveBeenLastCalledWith({
        query: {
          q: ["B"],
        },
      });
    });

    it("should allow targeting a path", () => {
      const mockRouter = {
        replace: jest.fn(),
      };
      const unifiedSearch = getUnifiedSearch(mockRouter);

      unifiedSearch.setFilters({}, "/search");

      expect(mockRouter.replace).toHaveBeenLastCalledWith({
        query: {},
        pathname: "/search",
      });
    });
  });

  describe("getSearchParamsFromFilters", () => {
    it("it should merge a list of filters into an object", () => {
      const unifiedSearch = getUnifiedSearch();

      const filterObject = unifiedSearch.getSearchParamsFromFilters([
        { key: "q", value: "A" },
        { key: "q", value: "B" },
        { key: "administrativeDivisionIds", value: "123" },
      ]);

      expect(filterObject).toMatchInlineSnapshot(`
        Object {
          "administrativeDivisionIds": Array [
            "123",
          ],
          "q": Array [
            "A",
            "B",
          ],
        }
      `);
    });
  });

  describe("modifyFilters", () => {
    it("should extend currently selected filters", () => {
      const mockRouter = {
        asPath: getAsPath({
          q: ["A"],
        }),
        replace: jest.fn(),
      };
      const unifiedSearch = getUnifiedSearch(mockRouter);

      unifiedSearch.modifyFilters({
        q: ["B"],
        administrativeDivisionIds: ["123"],
      });

      expect(mockRouter.replace.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          Object {
            "pathname": undefined,
            "query": Object {
              "administrativeDivisionIds": Array [
                "123",
              ],
              "ontologyTreeIds": Array [],
              "q": Array [
                "A",
                "B",
              ],
            },
          },
        ]
      `);
    });
  });

  describe("getFiltersWithout", () => {
    it("should drop the key,string pair that matches the parameters", () => {
      const mockRouter = {
        asPath: getAsPath({
          q: ["A", "B"],
        }),
      };
      const unifiedSearch = getUnifiedSearch(mockRouter);

      expect(unifiedSearch.getFiltersWithout("q", "A")).toMatchInlineSnapshot(`
        Object {
          "q": Array [
            "B",
          ],
        }
      `);
    });
  });
});
