import { LoadingSpinner } from "hds-react";
import { useTranslation } from "next-i18next";
import { RefObject } from "react";

import Section from "../../common/components/section/Section";
import List from "../../common/components/list/List";
import CondensedCard from "../../common/components/card/CondensedCard";
import { useUpcomingEventsQuery } from "../nextApi/upcomingEventsQuery";
import useRouter from "../i18n/router/useRouter";
import getEventsAsItems from "./utils/getEventsAsItems";

type Props = {
  linkedId: string;
  keywords: string[];
  containerRef?: RefObject<HTMLElement> | ((node?: HTMLElement) => void);
  defer?: boolean;
};

// This component expects to find the apiApolloClient from Context
export default function UpcomingEventsSection({
  linkedId,
  keywords,
  containerRef,
  defer = false,
}: Props) {
  const { t } = useTranslation("upcoming_events_section");
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const {
    loading,
    error,
    data = null,
  } = useUpcomingEventsQuery({
    variables: {
      where: {
        location: linkedId,
        start: "now",
        sort: "start_time",
        superEventType: "none",
        keywords: keywords,
      },
      first: 6,
    },
    skip: defer,
    ssr: false,
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // In case of an error, silently fail.
  if (error) {
    return null;
  }

  const eventItems = getEventsAsItems(
    data?.events?.edges?.map((edge) => edge.node)
  );

  // In case there are no upcoming events, hide the section.
  if (eventItems.length === 0 && data !== null) {
    return null;
  }

  return (
    <Section
      title={t("title")}
      koros="storm"
      contentWidth="s"
      ref={containerRef}
    >
      {loading && <LoadingSpinner />}
      <List
        variant="grid-3"
        gap="m"
        items={eventItems.map((item) => (
          <CondensedCard key={item.id} {...item} />
        ))}
      />
    </Section>
  );
}
