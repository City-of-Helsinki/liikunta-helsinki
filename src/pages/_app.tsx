import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { LoadingSpinner } from "hds-react";
import Error from "next/error";

import { useCmsApollo } from "../client/cmsApolloClient";
import useRouter from "../domain/i18nRouter/useRouter";
import AppMeta from "../components/meta/AppMeta";
import "../styles/globals.scss";

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
    <ApolloProvider client={cmsApolloClient}>
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
    </ApolloProvider>
  );
}

export default MyApp;
