import {
  createInstance as createMatomoInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const getMatomoUrlPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_MATOMO_URL_BASE}${path}`;

const matomoInstance = createMatomoInstance({
  disabled: process.env.NEXT_PUBLIC_MATOMO_ENABLED !== "true",
  urlBase: process.env.NEXT_PUBLIC_MATOMO_URL_BASE as string,
  srcUrl: getMatomoUrlPath("piwik.min.js"),
  trackerUrl: getMatomoUrlPath("tracker.php"),
  siteId: Number(process.env.NEXT_PUBLIC_MATOMO_SITE_ID),
});

const Matomo: React.FC = ({ children }) => {
  return (
    <MatomoProvider value={matomoInstance}>
      <TrackPageViews />
      {children}
    </MatomoProvider>
  );
};

const TrackPageViews: React.FC = () => {
  const { trackPageView } = useMatomo();
  const { asPath } = useRouter();

  // Track page changes when pathnname changes
  useEffect(() => {
    trackPageView({
      href: window.location.href,
    });
  }, [asPath, trackPageView]);

  return null;
};

export default Matomo;
