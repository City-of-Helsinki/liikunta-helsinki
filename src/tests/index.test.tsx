import { render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { NextRouter } from "next/router";

import App from "../pages/index";

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
  it("renders without crashing", () => {
    const languages = [
      {
        id: "1",
        name: "English",
        slug: "en",
        code: "EN",
        locale: "en_US",
      },
    ];

    render(
      <RouterContext.Provider value={mockRouter}>
        <App
          page={{
            layout: {
              navigationItems: [
                {
                  id: "1",
                  path: "/haku",
                  target: "",
                  title: "Haku",
                  url: "/haku",
                },
                {
                  id: "3",
                  path: "/liikuntatunnit",
                  target: "",
                  title: "Liikuntatunnit",
                  url: "/liikuntatunnit",
                },
              ],
              languages,
            },
            languages,
          }}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Liikunta-Helsinki")).toBeInTheDocument();
  });
});
