import React from "react";
import Head from "next/head";

import RouteMeta from "./RouteMeta";

export type Props = React.ComponentProps<typeof RouteMeta> & {
  // Title of page, required for accessibility: pages should have unique titles
  // so that screen reader users are able to determine when the current page is
  // changed.
  title: string;
  description?: string | null;
  image?: string | null;
  canonicalUrl?: string;
  openGraphDescription?: string;
  openGraphTitle?: string;
  openGraphType?: string;
  twitterDescription?: string;
  twitterTitle?: string;
};

function PageMeta({
  title,
  description,
  image,
  languages,
  openGraphType,
  twitterDescription,
  twitterTitle,
  ...seo
}: Props) {
  const openGraphTitle = seo.openGraphTitle ?? title;
  const openGraphDescription = seo.openGraphDescription ?? description;

  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta property="og:title" content={openGraphTitle} />
        {description && (
          <meta property="og:description" content={openGraphDescription} />
        )}
        {image && <meta property="og:image" content={image} />}
        {openGraphType && <meta property="og:type" content={openGraphType} />}
        {twitterTitle && <meta name="twitter:title" content={twitterTitle} />}
        {twitterDescription && (
          <meta name="twitter:description" content={twitterDescription} />
        )}
      </Head>
      <RouteMeta languages={languages} />
    </>
  );
}

export default PageMeta;
