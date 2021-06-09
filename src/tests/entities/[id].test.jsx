import { act } from "react-dom/test-utils";

import { PAGE_QUERY } from "../../components/page/Page";
import EntityPage from "../../pages/entities/[id]";
import { render, screen, waitFor } from "../utils";
import mockMenus from "../mockData/mockMenus";

const getMocks = () => [
  {
    request: {
      query: PAGE_QUERY,
      variables: {
        menuLocation: "PRIMARY",
      },
    },
    response: {
      pageLanguages: [
        {
          id: "1",
          name: "English",
          slug: "en",
          code: "EN",
          locale: "en_US",
        },
      ],
      pageMenus: mockMenus,
    },
  },
];

describe("entities/[id]", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<EntityPage />, getMocks());
    });

    await waitFor(() =>
      expect(
        screen.getByText("Eiran uimaranta", { selector: "h2" })
      ).toBeInTheDocument()
    );
  });
});
