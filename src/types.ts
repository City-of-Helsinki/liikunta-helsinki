import { UrlObject } from "url";

import { OperationVariables, QueryResult } from "@apollo/client";

import { Sources } from "./domain/app/appConstants";

export type Locale = "fi" | "sv" | "en";

export type MenuItem = {
  id: string;
  order: number;
  path: string;
  target: string;
  title: string;
  url: string;
  label: string;
};

export type NavigationItem = MenuItem;

export type Language = {
  id: string;
  name: string;
  slug: string;
  code: string;
  locale: string;
};

export type Keyword = {
  label: string | JSX.Element;
  isHighlighted?: boolean;
  href: string | UrlObject;
};

export type ItemInfoLineObject = {
  text: string;
  icon: React.ReactNode;
};

export type Item = {
  id: string;
  title: string;
  pre?: string;
  infoLines: (ItemInfoLineObject | string)[];
  keywords: Keyword[];
  href: string | UrlObject;
  location?: number[];
  image: string;
};

export type MapItem = {
  id: string;
  title: string;
  pre?: string;
  href: string;
  location?: number[];
};

export type LandingPage = {
  title: string;
  desktopImage: {
    uri: string;
  };
  link: string;
};

export type Recommendation = {
  id: string;
  keywords: string[];
  pre: string;
  title: string;
  infoLines: string[];
  href: string;
  image: string;
};

export type Node<T> = {
  cursor: string;
  node: T;
};

export type Connection<T> = {
  edges: Node<T>[];
};

export type EventSelected = {
  module: "event_selected";
  events: string[];
  title: string;
};

export type EventSearch = {
  module: "event_search";
  url: string;
  title: string;
};

export type LocationsSelected = {
  module: "locations_selected";
  url: string;
  title: string;
};

export type Collection = {
  id: string;
  translation?: {
    title?: string;
    description?: string;
    image?: string;
    slug: string;
    modules: Array<EventSelected | EventSearch | LocationsSelected>;
  };
};

export type LocalizedString = {
  fi?: string;
  sv?: string;
  en?: string;
};

type Image = {
  url: string;
  caption: string | null;
};

export type Venue = {
  name: LocalizedString;
  description: LocalizedString;
  meta: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  images: Image[] | null;
  location: {
    geoLocation: {
      geometry: {
        coordinates: number[];
      };
    };
    address: {
      streetAddress?: LocalizedString;
      postalCode?: string;
      city?: LocalizedString;
    };
  };
  ontologyWords: [
    {
      id: string;
      label: LocalizedString;
    }
  ];
  openingHours: {
    today: Time[];
  };
};

export type SearchResult = {
  venue: Venue;
};

export type TranslationsObject = {
  fi?: string;
  en?: string;
  sv?: string;
};

export type AccessibilitySentences = {
  groupName: string;
  sentences: string[];
};

export type AccessibilityTranslationsObject = {
  fi?: AccessibilitySentences[];
  en?: AccessibilitySentences[];
  sv?: AccessibilitySentences[];
};

export type Point = {
  type: "Point";
  coordinates: number[];
};

type Ontology = {
  id: number;
  label: string;
};

export type VenueDetails<T = TranslationsObject> = {
  id: string;
  dataSource: string | null;
  email: string | null;
  postalCode: string;
  image: string | null;
  addressLocality: T | null;
  position: Point | null;
  description: T | null;
  name: T | null;
  infoUrl: T | null;
  streetAddress: T | null;
  telephone: T | null;
  ontologyTree: Ontology[];
  ontologyWords: Ontology[];
  accessibilitySentences:
    | AccessibilityTranslationsObject
    | AccessibilitySentences;
  connections: Array<{
    sectionType: string;
    name: T;
  }>;
};

export type Source = typeof Sources[keyof typeof Sources];

export type TimeResourceState =
  | "open"
  | "closed"
  | "undefined"
  | "self_service"
  | "with_key"
  | "with_reservation"
  | "open_and_reservable"
  | "with_key_and_reservation"
  | "enter_only"
  | "exit_only"
  | "weather_permitting";

export type Time = {
  name: string;
  description: string;
  startTime: string;
  endTime: string;
  endTimeOnNextDay: boolean;
  resourceState: TimeResourceState;
  fullDay: boolean;
  periods: number[];
};

export type OpeningHour = {
  date: string;
  times: Time[];
};

export type AnyObject = Record<string, unknown>;

export type Context = {
  language?: Locale;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataSources?: any;
};

export type EventOffer = {
  isFree: boolean;
  description: string | null;
  price: string | null;
  infoUrl: string | null;
};

export type Event = {
  id: string;
  name: string | null;
  shortDescription: string | null;
  startTime: string;
  endTime: string | null;
  infoUrl: string | null;
  offers: EventOffer[];
  images: {
    id: string | null;
    alt: string | null;
    url: string | null;
  }[];
};

export type Address = {
  streetName: string;
  zip: string;
  city: string;
};

export type Option = {
  label: string;
  value: string;
};

export type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  endCursor: string;
  count: number;
};

export type ItemQueryResult<TVariables = OperationVariables> = Omit<
  QueryResult<null, TVariables>,
  "data"
> & {
  items: Item[];
  pageInfo?: PageInfo;
  totalCount: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};
