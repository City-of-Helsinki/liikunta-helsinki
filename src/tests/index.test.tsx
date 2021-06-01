import { render, screen, waitFor } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";

import App, { LANDING_PAGE_QUERY } from "../pages/index";
import { PAGE_QUERY } from "../components/page/Page";
import mockLandingPage from "./mockData/landingPage";

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
      pageMenuItems: {
        nodes: [
          {
            id: "1",
            path: "/haku",
            target: "",
            title: "Haku",
            url: "/haku",
            order: 1,
          },
          {
            id: "3",
            path: "/liikuntatunnit",
            target: "",
            title: "Liikuntatunnit",
            url: "/liikuntatunnit",
            order: 2,
          },
        ],
      },
    },
  },
];

const mockRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  replace: jest.fn(() => Promise.resolve(true)),
  back: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isPreview: false,
  isReady: true,
  locale: "fi",
  defaultLocale: "fi",
};

describe("App", () => {
  it("renders without crashing", async () => {
    await act(async () => {
      render(
        <RouterContext.Provider value={mockRouter}>
          <MockedProvider mocks={getMocks()} addTypename={false}>
            <App />
          </MockedProvider>
        </RouterContext.Provider>
      );
    });

    await waitFor(() =>
      expect(screen.getByText("Kesän parhaat uimarannat")).toBeInTheDocument()
    );
  });
});
