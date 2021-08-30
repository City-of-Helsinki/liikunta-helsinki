import { gql } from "@apollo/client";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import { useEffect } from "react";
import groupBy from "lodash.groupby";

import { Collection, EventSearch } from "../../types";
import getEventQueryFromCMSEventSearch from "../../util/events/getEventQueryFromCMSEventSearch";
import { useNextApiApolloClient } from "../../client/nextApiApolloClient";
import { logger } from "../../domain/logger";

async function resolveEventCountForEventSearch(
  eventSearchCollectionModule: EventSearch,
  client
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
  });

  return result?.data?.events?.totalCount as number;
}

async function resolveCounts(
  modules: Collection["translation"]["modules"],
  apiClient
) {
  const { event_selected: eventSelected = [], event_search: eventSearch = [] } =
    groupBy(modules, "module");
  const eventSelectedCount = eventSelected.reduce(
    (acc, module) => acc + module.events.length,
    0
  );
  const eventSearchResults = await Promise.all(
    eventSearch.map((module) =>
      resolveEventCountForEventSearch(module, apiClient)
    )
  );
  const eventSearchCount = eventSearchResults.reduce(
    (acc: number, eventSearchResultCount: number) =>
      acc + eventSearchResultCount,
    0
  );

  return eventSelectedCount + eventSearchCount;
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
  const apiClient = useNextApiApolloClient();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<boolean>();
  const [totalEventCount, setTotalEventCount] = useState<boolean>();

  useEffect(() => {
    let ignore = false;

    if (!ignore && !defer) {
      setLoading(true);
      resolveCounts(collection.translation.modules, apiClient)
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
  }, [apiClient, collection.translation.modules, defer]);

  if (loading || error) {
    return null;
  }

  return (
    <>
      {totalEventCount} {t("pcs")}
    </>
  );
}
