import "nprogress/nprogress.css";
import * as Sentry from "@sentry/browser";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { LoadingSpinner } from "hds-react";
import Error from "next/error";
import { appWithTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";

import { useCmsApollo } from "../domain/clients/cmsApolloClient";
import useRouter from "../domain/i18n/router/useRouter";
import AppMeta from "../domain/seo/meta/AppMeta";
import GeolocationProvider from "../common/geolocation/GeolocationProvider";
import "../styles/globals.scss";
import Matomo from "../domain/matomo/Matomo";
import AppConfig from "../domain/app/AppConfig";

if (process.env.NODE_ENV === "production") {
  Sentry.init(AppConfig.sentryConfiguration);
}

const TopProgressBar = dynamic(
  () => {
    return import("../common/components/topProgressBar/TopProgressBar");
  },
  { ssr: false }
);

function Center({ children }) {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);

  // Unset hidden visibility that was applied to hide the first server render
  // that does not include styles from HDS. HDS applies styling by injecting
  // style tags into the head. This requires the existence of a document object.
  // The document object does not exist during server side renders.
  // TODO: Remove this hackfix to ensure that pre-rendered pages'
  //       SEO performance is not impacted.
  useEffect(() => {
    setTimeout(() => {
      const body = document?.body;

      if (body) {
        body.style.visibility = "unset";
      }
    }, 10);
  }, []);

  return (
    <>
      <TopProgressBar />
      <ApolloProvider client={cmsApolloClient}>
        <GeolocationProvider>
          <Matomo>
            <AppMeta />
            {router.isFallback ? (
              <Center>
                <LoadingSpinner />
              </Center>
            ) : pageProps.error ? (
              <Error
                statusCode={pageProps.error.networkError?.statusCode ?? 400}
                title={pageProps.error.title}
              />
            ) : (
              <Component {...pageProps} />
            )}
          </Matomo>
        </GeolocationProvider>
      </ApolloProvider>
      <ToastContainer />
    </>
  );
}

export default appWithTranslation(MyApp);
