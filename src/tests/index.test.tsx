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
          global={{
            menuItems: [
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
          }}
          landingPage={{
            title: "Kesän parhaat uimarannat",
            desktopImage: {
              uri:
                "https://finna.fi/Cover/Show?id=hkm.HKMS000005:km00390n&size=master&index=0",
            },
            link: "/tips/uimarannat",
          }}
          recommendations={[
            {
              id: "1",
              keywords: ["Tänään"],
              pre: "12.5.2021, klo 19.00",
              title: "Karanteeniteatteri: Naurua kolmannella (stream)",
              infoLines: [
                "Tiivistämö, Sörnäisten rantatie 22 / Kaasutehtaankatu 1, Helsinki",
                "12€ + palvelumaksu",
              ],
              href: `/event/1`,
              image: "https://api.hel.fi/linkedevents/media/images/naurua3.jpg",
            },
          ]}
          collections={[]}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Kesän parhaat uimarannat")).toBeInTheDocument();
  });
});
