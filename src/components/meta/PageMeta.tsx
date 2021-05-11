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
};

function PageMeta({ title, description, image, languages }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}

        <meta property="og:title" content={title} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {image && <meta property="og:image" content={image} />}
      </Head>
      <RouteMeta languages={languages} />
    </>
  );
}

export default PageMeta;
