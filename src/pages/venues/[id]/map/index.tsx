import { isApolloError, useQuery } from "@apollo/client";
import { IconArrowLeft } from "hds-react";
import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { VENUE_QUERY } from "..";
import Page from "../../../../common/components/page/Page";
import initializeCmsApollo from "../../../../domain/clients/cmsApolloClient";
import initializeNextApiApolloClient, {
  useNextApiApolloClient,
} from "../../../../domain/clients/nextApiApolloClient";
import Link from "../../../../domain/i18n/router/Link";
import useRouter from "../../../../domain/i18n/router/useRouter";
import { getLocaleOrError } from "../../../../domain/i18n/router/utils";
import serverSideTranslationsWithCommon from "../../../../domain/i18n/serverSideTranslationsWithCommon";
import { staticGenerationLogger } from "../../../../domain/logger";
import styles from "./map.module.scss";

const MapView = dynamic(
  () => import("../../../../common/components/mapView/MapView"),
  {
    ssr: false,
  }
);

export default function VenueMapPage(props) {
  const nextApiApolloClient = useNextApiApolloClient(
    props.initialNextApiApolloState
  );
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, error } = useQuery(VENUE_QUERY, {
    variables: {
      id: router.query.id,
    },
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    client: nextApiApolloClient,
  });

  if (error) {
    return null;
  }

  const title = data.venue?.name;
  const venueId = data.venue?.id;
  const location = data.venue?.position?.coordinates;
  const lat = location[0];
  const lng = location[1];
  const venueMapItem = {
    id: venueId,
    title,
    href: `/venues/tprek:${data.venue?.id}`,
    location,
  };
  const backHref = {
    pathname: "/venues/[id]",
    query: {
      id: venueId,
    },
  };

  return (
    <Page title={title} showFooter={false}>
      <div className={styles.content}>
        <div className={styles.mapHeader}>
          <Link href={backHref}>
            <a aria-label="Takaisin paikkanäkymään">
              <IconArrowLeft aria-hidden="true" size="l" />
            </a>
          </Link>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <MapView zoom={20} center={[lng, lat]} items={[venueMapItem]} />
      </div>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const nextApiClient = initializeNextApiApolloClient();
  const cmsClient = initializeCmsApollo();

  try {
    await cmsClient.pageQuery({
      nextContext: context,
    });
    await nextApiClient.query({
      query: VENUE_QUERY,
      variables: {
        id: context.params.id,
      },
      context: {
        headers: {
          "Accept-Language": context.locale ?? context.defaultLocale,
        },
      },
    });

    return {
      props: {
        initialApolloState: cmsClient.cache.extract(),
        initialNextApiApolloState: nextApiClient.cache.extract(),
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale),
          ["venue_page", "map_box", "map_view"]
        )),
      },
      revalidate: 10,
    };
  } catch (e) {
    staticGenerationLogger.error("Error while generating a venue page:", e);
    if (isApolloError(e)) {
      return {
        props: {
          error: {
            statusCode: 400,
          },
        },
        revalidate: 10,
      };
    }

    throw e;
  }
}
