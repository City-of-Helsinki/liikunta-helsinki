import { useQuery, gql } from "@apollo/client";
import { LoadingSpinner } from "hds-react";
import { useTranslation } from "next-i18next";

import getEventsAsItems from "../../util/events/getEventsAsItems";
import eventFragment from "../../util/events/eventFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import Section from "../../components/section/Section";
import List from "../../components/list/List";
import CondensedCard from "../../components/card/CondensedCard";

const UPCOMING_EVENTS_QUERY = gql`
  query UpcomingEventsQuery($where: EventQuery!, $first: Int) {
    events(where: $where, first: $first) {
      edges {
        node {
          ...eventFragment
        }
      }
    }
  }
  ${eventFragment}
`;

type Props = {
  linkedId: string;
};

// This component expects to find the apiApolloClient from Context
export default function UpcomingEventsSection({ linkedId }: Props) {
  const { t } = useTranslation("upcoming_events_section");
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { loading, error, data } = useQuery(UPCOMING_EVENTS_QUERY, {
    variables: {
      where: {
        location: linkedId,
        start: "now",
        sort: "start_time",
        superEventType: "none",
      },
      first: 6,
    },
    skip: !process.browser,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  // In case of an error, silently fail.
  if (error) {
    return null;
  }

  const eventItems = getEventsAsItems(
    data?.events?.edges?.map((edge) => edge.node)
  );

  // In case there are no upcoming events, hide the section.
  if (eventItems.length === 0) {
    return null;
  }

  return (
    <Section title={t("title")} koros="storm" contentWidth="s">
      <List
        variant="grid-3"
        items={eventItems.map((item) => (
          <CondensedCard key={item.id} {...item} />
        ))}
      />
    </Section>
  );
}
