import { act } from "react-dom/test-utils";

import { render, screen, waitFor } from "./utils";
import App, { LANDING_PAGE_QUERY } from "../pages/index";
import { PAGE_QUERY } from "../components/page/Page";
import mockLandingPage from "./mockData/landingPage";
import mockMenus from "./mockData/mockMenus";

const getMocks = () => [
  {
    request: {
      query: LANDING_PAGE_QUERY,
      variables: {
        languageCode: "FI",
        languageCodeFilter: "FI",
      },
    },
    result: {
      data: {
        collections: { edges: [] },
        landingPage: {
          id: "sdkjfn1",
          translation: mockLandingPage,
        },
      },
    },
  },
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

describe("App", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(<App />, getMocks());
    });

    await waitFor(() =>
      expect(screen.getByText("Kesän parhaat uimarannat")).toBeInTheDocument()
    );
  });
});
