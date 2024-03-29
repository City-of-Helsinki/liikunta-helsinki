import userEvent from "@testing-library/user-event";

import { VENUE_QUERY, VenuePageContent } from "../../pages/venues/[id]";
import { render, screen, waitFor } from "../../tests/utils";
import { getVenue, defaultConnections } from "./__mocks__/[id]";

const id = "tprek:25";
const initialPriceLines = 4;
const getMocks = () => [
  {
    request: {
      query: VENUE_QUERY,
      variables: {
        id,
        includeHaukiFields: true,
      },
      context: {
        headers: {
          "Accept-Language": "fi",
        },
      },
    },
    result: {
      data: {
        venue: getVenue({ id }),
      },
    },
  },
];

function getLinesFromConnections(connections) {
  return connections
    .map((item) => item.name)
    .join("\n\n")
    .split("\n");
}

function stringifyLines(lines) {
  return (
    lines
      .join(" ")
      // Ignore wrapping whitespace
      .trim()
      // Collapse double space
      .replace(/\s\s+/g, " ")
  );
}

let env;
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2021, 5, 22, 12, 0, 0, 0));

  env = process.env;
  process.env.NEXT_PUBLIC_HAUKI_ENABLED = "true";
});

afterAll(() => {
  jest.useRealTimers();

  process.env = env;
});

test("venues/[id] renders correctly", async () => {
  render(<VenuePageContent />, getMocks(), {
    query: {
      id,
    },
  });

  await waitFor(() => screen.getByText("Eiran uimaranta", { selector: "h2" }));

  // -- Check that the user can access price information correctly
  const allPriceConnectionsContentLines = getLinesFromConnections(
    defaultConnections.filter((item) => item.sectionType === "PRICE")
  );
  const startOfFirstPriceConnection = stringifyLines(
    allPriceConnectionsContentLines.slice(0, initialPriceLines)
  );
  // User sees the beginning of the price
  expect(screen.getByText(startOfFirstPriceConnection)).toBeInTheDocument();

  const restOfPriceConnectionsContent = stringifyLines(
    allPriceConnectionsContentLines.slice(initialPriceLines)
  );

  userEvent.click(screen.getAllByRole("button", { name: "Näytä kaikki" })[0]);
  // After clicking user can view all price information
  expect(screen.queryByText(restOfPriceConnectionsContent)).toBeInTheDocument();

  // -- Check that current opening status is communicated from hauki if
  // available
  expect(
    screen.getByText("Auki tällä hetkellä, sulkeutuu 16:00")
  ).toBeInTheDocument();

  // -- Check that the user can access opening hours
  const allOpeningHoursConnectionsContentLines = getLinesFromConnections(
    defaultConnections.filter((item) => item.sectionType === "OPENING_HOURS")
  );
  const startOfOpeningHoursConnection = stringifyLines(
    allOpeningHoursConnectionsContentLines.slice(0, 10)
  );
  expect(screen.getByText(startOfOpeningHoursConnection)).toBeInTheDocument();

  userEvent.click(screen.getByRole("button", { name: "Näytä kaikki" }));
  // After clicking user can view all price information
  const restOfOpeningHoursConnectionsContent = stringifyLines(
    allOpeningHoursConnectionsContentLines.slice(10)
  );
  expect(
    screen.queryByText(restOfOpeningHoursConnectionsContent)
  ).toBeInTheDocument();
});
