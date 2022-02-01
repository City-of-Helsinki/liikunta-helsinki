import {
  createInstance as createMatomoInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import Config from "../../config";

const matomoInstance = createMatomoInstance(Config.matomoConfiguration);

function Matomo({ children }: { children: React.ReactNode }) {
  return (
    <MatomoProvider value={matomoInstance}>
      <TrackPageViews />
      {children}
    </MatomoProvider>
  );
}

function TrackPageViews(): null {
  const { trackPageView } = useMatomo();
  const { asPath } = useRouter();

  // Track page changes when pathnname changes
  useEffect(() => {
    trackPageView({
      href: window.location.href,
    });
  }, [asPath, trackPageView]);

  return null;
}

export default Matomo;
