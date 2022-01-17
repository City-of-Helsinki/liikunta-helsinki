import userEvent from "@testing-library/user-event";

import { VENUE_QUERY, VenuePageContent } from "../../pages/venues/[id]";
import { render, screen, waitFor } from "../utils";
import { getVenue, defaultConnections } from "./mocks/[id]";

const id = "tprek:25";
const getMocks = () => [
  {
    request: {
      query: VENUE_QUERY,
      variables: {
        id,
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

test("venues/[id] renders correctly", async () => {
  render(<VenuePageContent />, getMocks(), {
    query: {
      id,
    },
  });

  await waitFor(() => screen.getByText("Eiran uimaranta", { selector: "h2" }));

  // -- Check that the user can access price information correctly
  const allPriceConnectionsContentLines = defaultConnections
    .filter((item) => item.sectionType === "PRICE")
    .map((item) => item.name)
    .join("\n\n")
    .split("\n");
  const startOfFirstPriceConnection = allPriceConnectionsContentLines
    .slice(0, 3)
    // Testing library does some formatting to text content which removes line
    // changes. Matching with them fails, matching without works.
    .join("");
  // User sees the beginning of the price
  expect(screen.getByText(startOfFirstPriceConnection)).toBeInTheDocument();

  const allPriceConnectionsContent = allPriceConnectionsContentLines
    // Join with a space, but replace all double spaces with a single space
    .join(" ")
    .replace(/\s\s+/g, " ");

  userEvent.click(screen.getByRole("button", { name: "show_long_price" }));
  // After clicking user can view all price information
  expect(screen.queryByText(allPriceConnectionsContent)).toBeInTheDocument();
});
