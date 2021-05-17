import { render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";
import { MockedProvider } from "@apollo/client/testing";
import { act } from "react-dom/test-utils";

import App, { LANDING_PAGE_QUERY } from "../pages/index";
import { PAGE_QUERY } from "../components/page/Page";

const getMocks = () => [
  {
    request: {
      query: LANDING_PAGE_QUERY,
    },
    result: {
      data: {
        collections: { edges: [] },
      },
    },
  },
  {
    request: {
      query: PAGE_QUERY,
    },
    response: {
      languages: [
        {
          id: "1",
          name: "English",
          slug: "en",
          code: "EN",
          locale: "en_US",
        },
      ],
      menuItems: {
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
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isPreview: false,
  isReady: true,
  locale: "en",
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

    expect(screen.getByText("Kesän parhaat uimarannat")).toBeInTheDocument();
  });
});
