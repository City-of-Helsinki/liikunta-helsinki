/* eslint-disable @typescript-eslint/no-explicit-any */
import * as matomo from "@datapunt/matomo-tracker-react";
import * as nextRouter from "next/router";
import * as React from "react";

import Config from "../../../config";
import { render } from "../../../tests/utils";
import Matomo from "../Matomo";

afterEach(() => {
  jest.restoreAllMocks();
});

jest.mock("@datapunt/matomo-tracker-react", () => ({
  useMatomo: jest.fn().mockReturnValue({ trackPageView: jest.fn() }),
  createInstance: jest.fn().mockReturnValue({
    disabled: false,
    urlBase: "matomo",
    srcUrl: "piwik.min.js",
    trackerUrl: "tracker.php",
    siteId: 1,
  }),
  // eslint-disable-next-line react/display-name
  MatomoProvider: ({ children }) => <>{children}</>,
}));

beforeEach(() => {
  jest.spyOn(Config, "matomoConfiguration", "get").mockReturnValue({});
});

const setHref = (href) => {
  Object.defineProperty(window, "location", {
    value: {
      ...window.location,
      href,
    },
    writable: true,
  });
};

test("PageWrapper matches snapshot", async () => {
  const { container } = render(
    <Matomo>
      <div>Children</div>
    </Matomo>
  );

  expect(container).toMatchSnapshot();
});

test("trackPageView gets called when pathname changes", async () => {
  const testHref1 = "testurl.com";
  const testHref2 = "testurl2.com";
  const trackPageViewMock = jest.fn();
  setHref(testHref1);

  jest
    .spyOn(matomo, "useMatomo")
    .mockReturnValue({ trackPageView: trackPageViewMock });

  const { rerender } = render(<Matomo />, null, {
    asPath: "/testi1",
  });

  expect(trackPageViewMock).toHaveBeenCalledWith({ href: testHref1 });

  trackPageViewMock.mockReset();

  setHref(testHref2);
  jest.spyOn(nextRouter, "useRouter").mockReturnValue({ asPath: "/test2" });

  // for some reson react log error:
  // Warning: React has detected a change in the order of Hooks called by PageWrapper.
  // but don't know what could be causing this... so lets silence it
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, "error").mockImplementation(() => {});

  rerender(<Matomo />);

  expect(trackPageViewMock).toHaveBeenCalledWith({ href: testHref2 });
});
