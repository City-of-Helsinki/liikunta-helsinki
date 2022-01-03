import getVenueIdParts from "../getVenueIdParts";

test("should return parts correctly", () => {
  expect(getVenueIdParts("lipas:12345")).toMatchInlineSnapshot(`
    Object {
      "id": "12345",
      "source": "lipas",
    }
  `);
});

test("should throw error when input is incorrectly formatted", () => {
  expect(() => getVenueIdParts("12345")).toThrowErrorMatchingInlineSnapshot(
    `"ID is not correctly formatted"`
  );
});
