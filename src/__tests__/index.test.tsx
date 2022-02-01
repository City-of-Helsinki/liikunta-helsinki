import { act } from "react-dom/test-utils";

import { render, screen, waitFor } from "../tests/utils";
import App, { LANDING_PAGE_QUERY } from "../pages/index";
import { PAGE_QUERY } from "../common/components/page/Page";
import mockLandingPage from "./__mocks__/landingPage";
import mockMenus from "./__mocks__/mockMenus";

const getMocks = () => [
  {
    request: {
      query: LANDING_PAGE_QUERY,
      variables: {
        languageCode: "FI",
      },
    },
    result: {
      data: {
        landingPage: mockLandingPage,
        page: { translation: { seo: {} }, modules: [] },
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
    result: {
      data: {
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
  },
];

beforeAll(() => {
  jest.useFakeTimers();
});

test("renders correctly", async () => {
  // Fix system time so that the shortcuts that get rendered are stable
  jest.setSystemTime(new Date("2012-06-01"));

  await act(async () => {
    render(<App />, getMocks());
  });

  await waitFor(() =>
    expect(screen.getByText("Kesän parhaat uimarannat")).toBeInTheDocument()
  );

  ["Ulkokuntosalit", "Uinti", "Skeittaus"].forEach((shortcutLabel) => {
    expect(
      screen.getByRole("link", { name: shortcutLabel })
    ).toBeInTheDocument();
  });
}, 50000);
