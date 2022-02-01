import {
  createInstance as createMatomoInstance,
  MatomoProvider,
  useMatomo,
} from "@datapunt/matomo-tracker-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import Config from "../../config";

function Matomo({ children }: { children: React.ReactNode }): JSX.Element {
  const [matomoInstance] = useState(() => {
    const matomoConfig = Config.matomoConfiguration;
    return matomoConfig ? createMatomoInstance(matomoConfig) : null;
  });

  if (matomoInstance) {
    return (
      <MatomoProvider value={matomoInstance}>
        <TrackPageViews />
        {children}
      </MatomoProvider>
    );
  }
  return <>{children}</>;
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
