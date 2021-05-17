import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";

import { useCmsApollo } from "../api/cmsApolloClient";
import AppMeta from "../components/meta/AppMeta";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const cmsApolloClient = useCmsApollo(pageProps.initialApolloState);

  return (
    <ApolloProvider client={cmsApolloClient}>
      <AppMeta />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
