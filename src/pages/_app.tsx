import type { AppProps } from "next/app";

import AppMeta from "../components/meta/AppMeta";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppMeta />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
