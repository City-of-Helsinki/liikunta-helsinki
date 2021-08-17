import { act } from "react-dom/test-utils";

import { getOpeningHoursForWeek } from "../mockData/getOpeningHours";
import { VENUE_QUERY, VenuePageContent } from "../../pages/venues/[id]";
import { render, screen, waitFor } from "../utils";

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
        venue: {
          addressLocality: "Helsinki",
          dataSource: "",
          description: "",
          email: "",
          id,
          image: "",
          infoUrl: "https://hel.fi",
          name: "Eiran uimaranta",
          position: {
            type: "Point",
            coordinates: [1, 2],
          },
          postalCode: "00001",
          streetAddress: "Eirantie 3",
          telephone: "+35812345678",
          openingHours: getOpeningHoursForWeek(),
          isOpen: false,
          ontologyTree: [],
          ontologyWords: [],
        },
      },
    },
  },
];

describe("venues/[id]", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<VenuePageContent />, getMocks(), {
        query: {
          id,
        },
      });
    });

    await waitFor(() =>
      expect(
        screen.getByText("Eiran uimaranta", { selector: "h2" })
      ).toBeInTheDocument()
    );
  });
});
