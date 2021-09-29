import { useEffect } from "react";

import { useGeolocationContext } from "./GeolocationProvider";

type Config = {
  skip?: boolean;
};

export default function useGeolocation({
  skip = false,
}: Config | undefined = {}) {
  const { resolve, called, geolocation, ...delegated } =
    useGeolocationContext();

  useEffect(() => {
    // Defer resolving under not skipped
    // Don't resolve again if we have resolved before and found a geolocation
    if (!skip && !called && !geolocation) {
      resolve();
    }
  }, [resolve, skip, called, geolocation]);

  return { resolve, called, geolocation, ...delegated };
}
