import { useEffect } from "react";

import { useGeolocationContext } from "./GeolocationProvider";

type Config = {
  skip?: boolean;
};

export default function useGeolocation({ skip = false }: Config = {}) {
  const { resolve, called, coordinates, ...delegated } =
    useGeolocationContext();

  useEffect(() => {
    // Defer resolving under not skipped
    // Don't resolve again if we have resolved before and found a geolocation
    if (!skip && !called && !coordinates) {
      resolve();
    }
  }, [resolve, skip, called, coordinates]);

  return { resolve, called, coordinates, ...delegated };
}
