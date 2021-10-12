import { ApolloProvider, isApolloError, useQuery } from "@apollo/client";
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

const VenueMapPageContent: React.FC = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(VENUE_QUERY, {
    variables: {
      id: router.query.id,
    },
  });

  if (loading || error) {
    return null;
  }

  const location = data.venue?.position?.coordinates;
  const title = data.venue?.name;
  const venueId = data.venue?.id;
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
    <div className={styles.content}>
      <div className={styles.mapHeader}>
        <Link
          href={backHref}
          avoidEscaping
          aria-label="Takaisin paikkanäkymään"
        >
          <a>
            <IconArrowLeft aria-hidden="true" size="l" />
          </a>
        </Link>
        <h1 className={styles.title}>{title}</h1>
      </div>
      <MapView
        zoom={20}
        center={[location[1], location[0]]}
        items={[venueMapItem]}
      />
    </div>
  );
};

export default function VenueMapPage(props) {
  const nextApiApolloClient = useNextApiApolloClient(
    props.initialNextApiApolloState
  );

  return (
    <Page
      title="Liikunta-Helsinki"
      description="Liikunta-helsinki"
      showFooter={false}
    >
      <ApolloProvider client={nextApiApolloClient}>
        <VenueMapPageContent />
      </ApolloProvider>
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
