import { Sources } from "./constants";
import { Locale } from "./config";

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
  label: string;
  isHighlighted?: boolean;
  href: string;
};

export type Item = {
  id: string;
  title: string;
  pre?: string;
  infoLines: string[];
  keywords: Keyword[];
  href: string;
  image: string;
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

export type Collection = {
  id: string;
  translation?: {
    title?: string;
    description?: string;
    image?: string;
  };
};

export type LocalizedString = {
  fi: string;
  sv: string;
  en: string;
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
};

export type SearchResult = {
  venue: Venue;
};

export type TranslationsObject = {
  fi?: string;
  en?: string;
  sv?: string;
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
