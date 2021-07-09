import { useQuery, gql } from "@apollo/client";
import { LoadingSpinner } from "hds-react";
import {
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
  isSameDay,
} from "date-fns";
import fi from "date-fns/locale/fi";

import useRouter from "../../domain/i18nRouter/useRouter";
import Section from "../../components/section/Section";
import List from "../../components/list/List";
import CondensedCard from "../../components/card/CondensedCard";
import { Item, Event, Keyword, EventOffer } from "../../types";

const UPCOMING_EVENTS_QUERY = gql`
  query UpcomingEventsQuery($id: ID!) {
    upcomingEvents(id: $id) {
      id
      name
      shortDescription
      startTime
      endTime
      infoUrl
      offers {
        isFree
        description
        price
        infoUrl
      }
      images {
        id
        alt
        url
      }
    }
  }
`;

function getIsCloseInTimeKeyword({
  startTime,
  infoUrl,
}: Event): Keyword | null {
  const now = new Date();
  const startTimeAsDate = new Date(startTime);
  const isToday = isWithinInterval(startTimeAsDate, {
    start: startOfDay(now),
    end: endOfDay(now),
  });
  const isThisWeek = isWithinInterval(startTimeAsDate, {
    start: startOfWeek(now, { locale: fi }),
    end: endOfWeek(now, { locale: fi }),
  });

  if (!isToday && !isThisWeek) {
    return null;
  }

  const label = isToday ? "Tänään" : isThisWeek ? "Tällä viikolla" : "";

  return {
    label,
    href: infoUrl,
  };
}

function getIsFree(event: Event): Keyword | null {
  const isFree = event.offers.find(({ isFree }) => isFree);

  if (!isFree) {
    return null;
  }

  return {
    label: "Maksuton",
    href: event.infoUrl,
    isHighlighted: true,
  };
}

function formatOffer(offer?: EventOffer): string | null {
  if (!offer) {
    return null;
  }

  const { price, description } = offer;

  if (!price && !description) {
    return null;
  }

  return [price, offer.description ? `(${offer.description})` : null]
    .filter((item) => item)
    .join(" ");
}

const formatDateTime = (dateTime: Date): string =>
  format(dateTime, "d.M.yyyy, kk.mm");

function formatEventTime({ startTime, endTime }: Event): string {
  const startTimeDate = new Date(startTime);

  // If there's no end time, return just the start time
  // Example: 12.5.2021, 19.00
  if (!endTime) {
    return formatDateTime(new Date(startTimeDate));
  }

  const endTimeDate = new Date(endTime);

  // If times are within the same day end time hours and minutes as well
  // Example: 12.5.2021, 19.00 – 21.00
  if (isSameDay(startTimeDate, endTimeDate)) {
    return [
      format(startTimeDate, "d.M.yyyy, kk.mm"),
      format(endTimeDate, "kk.mm"),
    ].join(" – ");
  }

  // Otherwise there should be a start time and an end time which point to
  // different calendar dates. In that case, don't show time at all and
  // condense the output by only showing the day of month from start time.
  // Example: 11 – 12.5.2021
  return [format(startTimeDate, "d"), format(endTimeDate, "d.M.yyyy")].join(
    " – "
  );
}

function getEventsAsItems(events?: Event[]): Item[] {
  if (!events) {
    return [];
  }

  return events.map((event) => {
    const {
      id,
      name,
      shortDescription,
      infoUrl,
      images,
      offers: [offer],
    } = event;

    return {
      id,
      title: name,
      pre: formatEventTime(event),
      infoLines: [shortDescription, formatOffer(offer)].filter((item) => item),
      keywords: [getIsCloseInTimeKeyword(event), getIsFree(event)].filter(
        (item) => item
      ),
      href: infoUrl,
      image: images?.[0]?.url,
    };
  });
}

type Props = {
  linkedId: string;
};

// This component expects to find the apiApolloClient from Context
export default function UpcomingEventsSection({ linkedId }: Props) {
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { loading, error, data } = useQuery(UPCOMING_EVENTS_QUERY, {
    variables: { id: linkedId },
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

  const eventItems = getEventsAsItems(data?.upcomingEvents);

  // In case there are no upcoming events, hide the section.
  if (eventItems.length === 0) {
    return null;
  }

  return (
    <Section title="Seuravat tapahtumat" koros="storm" contentWidth="s">
      <List
        variant="columns-3"
        items={eventItems.map((item) => (
          <CondensedCard key={item.id} {...item} />
        ))}
      />
    </Section>
  );
}
