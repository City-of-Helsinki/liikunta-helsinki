import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useEffect } from "react";
import groupBy from "lodash.groupby";

import { Locale } from "../../../types";
import { Collection, EventSearch } from "../../../types";
import getEventQueryFromCMSEventSearch from "../../events/utils/getEventQueryFromCMSEventSearch";
import { useNextApiApolloClient } from "../../nextApi/nextApiApolloClient";
import { logger } from "../../logger";
import useRouter from "../../i18n/router/useRouter";
import SmallSpinner from "../../../common/components/spinners/SmallSpinner";

async function resolveEventCountForEventSearch(
  eventSearchCollectionModule: EventSearch,
  client,
  locale: Locale
): Promise<number> {
  const query = getEventQueryFromCMSEventSearch(
    eventSearchCollectionModule.url
  );

  const result = await client.query({
    query: gql`
      query SearchEventsCountQuery($where: EventQuery!) {
        events(where: $where) {
          totalCount
        }
      }
    `,
    variables: {
      where: query,
    },
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
  });

  return result?.data?.events?.totalCount as number;
}

async function resolveCounts(
  modules: Collection["translation"]["modules"],
  apiClient,
  locale: Locale
) {
  const {
    event_selected = [],
    event_search = [],
    locations_selected = [],
  } = groupBy(modules, "module");

  const eventSelectedCount = event_selected.reduce(
    (acc, module) => acc + module.events.length,
    0
  );
  const eventSearchResults = await Promise.all(
    event_search.map((module) =>
      resolveEventCountForEventSearch(module, apiClient, locale)
    )
  );
  const eventSearchCount = eventSearchResults.reduce(
    (acc: number, eventSearchResultCount: number) =>
      acc + eventSearchResultCount,
    0
  );
  const locationSelectedCount = locations_selected.reduce(
    (acc, module) => acc + module.locations.length,
    0
  );

  return eventSelectedCount + eventSearchCount + locationSelectedCount;
}

type Props = {
  collection: Collection;
  defer?: boolean;
};

export default function CollectionCountLabel({
  collection,
  defer = false,
}: Props) {
  const { t } = useTranslation("collection_count_label");
  const { locale } = useRouter();
  const apiClient = useNextApiApolloClient();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const [totalEventCount, setTotalEventCount] = useState<boolean>();

  useEffect(() => {
    const modules = collection?.translation?.modules ?? [];
    let ignore = false;

    if (!ignore && !defer) {
      setLoading(true);
      resolveCounts(modules, apiClient, locale)
        .then((count) => {
          setTotalEventCount(count);
        })
        .catch((e) => {
          setError(e);
          logger.error(e);
        })
        .finally(() => {
          if (!ignore) {
            setLoading(false);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [apiClient, collection?.translation?.modules, defer, locale]);

  if (error) {
    return null;
  }

  if (loading) {
    return <SmallSpinner />;
  }

  return (
    <>
      {totalEventCount} {t("pcs")}
    </>
  );
}
