import { useQuery, gql } from "@apollo/client";
import { LoadingSpinner } from "hds-react";

import { useNextApiApolloClient } from "../../client/nextApiApolloClient";
import getEventsAsItems from "../../util/events/getEventsAsItems";
import eventFragment from "../../util/events/eventFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import Section from "../../components/section/Section";
import List from "../../components/list/List";
import CondensedCard from "../../components/card/CondensedCard";

const SEARCH_EVENTS_QUERY = gql`
  query SearchEventsQuery($query: EventQuery!) {
    events(where: $query) {
      ...eventFragment
    }
  }

  ${eventFragment}
`;

function getEventQuery(url: string) {
  const params = new URL(url).searchParams;
  const { super_event_type, ...restOfQuery } = Object.fromEntries(params);

  return {
    ...restOfQuery,
    superEventType: super_event_type,
  };
}

type Props = {
  title: string;
  url: string;
};

export default function SearchEventsSection({ title, url }: Props) {
  const nextApiApolloClient = useNextApiApolloClient();
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { loading, error, data } = useQuery(SEARCH_EVENTS_QUERY, {
    client: nextApiApolloClient,
    variables: { query: getEventQuery(url) },
    skip: !process.browser,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <Section title={title}>
        <LoadingSpinner />
      </Section>
    );
  }

  // In case of an error, silently fail.
  if (error) {
    return null;
  }

  const eventItems = getEventsAsItems(data?.events);

  // In case there are no events
  if (eventItems.length === 0) {
    return null;
  }

  return (
    <Section title={title}>
      <List
        variant="grid-2"
        items={eventItems.map((item) => (
          <CondensedCard key={item.id} {...item} />
        ))}
      />
    </Section>
  );
}
