import { useEffect } from "react";

import { useGeolocationContext } from "./GeolocationProvider";

type Config = {
  skip?: boolean;
};

export default function useGeolocation({ skip = false }: Config = {}) {
  const { resolve, called, coordinates, loading, error, ...delegated } =
    useGeolocationContext();

  useEffect(() => {
    // Defer resolving under not skipped
    // Don't resolve again if we have resolved before and found a geolocation
    // Don't resolve if the previous resolve is ongoing
    if (!skip && !called && coordinates === undefined && !loading) {
      resolve();
    }
  }, [resolve, skip, called, coordinates, loading, error]);

  return { resolve, called, coordinates, loading, ...delegated };
}
