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
  onClick: () => void;
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
  title: string;
  description: string;
  image: string;
};

export type LocalizedString = {
  fi: string;
  sv: string;
  en: string;
};

export type Venue = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
};

export type SearchResult = {
  venue: Venue;
};

export type TranslationsObject = {
  fi: string;
  en: string;
  sv: string;
};

export type VenueDetails = {
  id: string;
  data_source: string | null;
  email: string | null;
  contact_type: string | null;
  postal_code: string;
  image: string | null;
  address_locality: TranslationsObject;
  position: {
    type: string;
    coordinates: number[] | null[];
  };
  description: string | null;
  name: TranslationsObject;
  info_url: string | null;
  street_address: TranslationsObject;
  telephone: string | null;
};
