import Head from "next/head";

function AppMeta() {
  return (
    <Head>
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Liikunta Helsinki" />

      {/* Force summary card */}
      <meta name="twitter:card" content="summary" />
    </Head>
  );
}

export default AppMeta;
