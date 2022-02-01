import { useQuery } from "@apollo/client";
import { IconArrowLeft } from "hds-react";
import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "next-i18next";

import { VENUE_QUERY } from "..";
import Page from "../../../../common/components/page/Page";
import getLiikuntaStaticProps from "../../../../domain/app/getLiikuntaStaticProps";
import {
  createNextApiApolloClient,
  useNextApiApolloClient,
} from "../../../../domain/clients/nextApiApolloClient";
import Link from "../../../../domain/i18n/router/Link";
import useRouter from "../../../../domain/i18n/router/useRouter";
import { getLocaleOrError } from "../../../../domain/i18n/router/utils";
import serverSideTranslationsWithCommon from "../../../../domain/i18n/serverSideTranslationsWithCommon";
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
  const { t } = useTranslation("venue_page");
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;

  // use venueId from query because tprek api returns venues with sources
  // that we don't support
  const venueId = router.query.id;
  const { data, error } = useQuery(VENUE_QUERY, {
    variables: {
      id: venueId,
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
  const location = data.venue?.position?.coordinates;
  const lat = location[0];
  const lng = location[1];
  const venueMapItem = {
    id: venueId as string,
    title,
    href: `/venues/${venueId}`,
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
            <a aria-label={t("back_to_venue_page_aria_label")}>
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
  const nextApiClient = createNextApiApolloClient();

  return getLiikuntaStaticProps(context, async () => {
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
        initialNextApiApolloState: nextApiClient.cache.extract(),
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale),
          ["venue_page", "map_box", "map_view"]
        )),
      },
    };
  });
}
