import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import { Coordinates } from "../../types";
import sendNotification from "../utils/sendToast";
import geolocationService from "./GeolocationService";

type GeolocationContextType = {
  geolocation: Coordinates | null;
  loading: boolean;
  called: boolean;
  error?: GeolocationPositionError;
  resolve: () => Promise<Coordinates | void>;
};

const GeolocationContext = createContext<GeolocationContextType>({
  geolocation: null,
  loading: false,
  called: false,
  resolve: () => Promise.resolve(),
});

type Props = {
  children: ReactNode;
};

export default function GeolocationProvider({ children }: Props) {
  const { t } = useTranslation("geolocation_provider");
  const [location, setLocation] = useState<Coordinates | undefined | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);
  const [error, setError] = useState<GeolocationPositionError | undefined>();

  const resolve = useCallback(async () => {
    // Defer until we are in the browser environment
    if (!process.browser) {
      return;
    }

    setLoading(true);

    if ("geolocation" in navigator) {
      sendNotification(
        t("a11ymessage.title"),
        t("a11ymessage.description"),
        "info",
        { invisible: true }
      );

      try {
        const coordinates = await geolocationService.getCurrentPosition();

        setLocation(coordinates);
      } catch (e) {
        setLocation(null);
        setError(e);
        sendNotification(
          t("error.title"),
          t(
            e.PERMISSION_DENIED
              ? "error.description.permission_denied"
              : "error.description.generic"
          ),
          "alert"
        );
      }

      setLoading(false);
      setCalled(true);
    } else {
      setLocation(null);
      setLoading(false);
      setCalled(true);
    }
  }, [t]);

  return (
    <GeolocationContext.Provider
      value={{
        geolocation: location,
        loading,
        error,
        called,
        resolve,
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocationContext() {
  return useContext(GeolocationContext);
}
