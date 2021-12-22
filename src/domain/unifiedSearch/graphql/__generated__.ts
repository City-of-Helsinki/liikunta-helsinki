import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  /** A (multidimensional) set of coordinates following x, y, z order. */
  GeoJSONCoordinates: any;
  /** Arbitrary JSON value */
  JSONObject: any;
};

/** TODO: take this from service map / TPREK */
export type AccessibilityProfile = {
  __typename?: 'AccessibilityProfile';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

/** TODO: give real structure */
export type Address = {
  __typename?: 'Address';
  city?: Maybe<LanguageString>;
  postalCode?: Maybe<Scalars['String']>;
  streetAddress?: Maybe<LanguageString>;
};

export type AdministrativeDivision = {
  __typename?: 'AdministrativeDivision';
  id?: Maybe<Scalars['ID']>;
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LanguageString>;
  type?: Maybe<Scalars['String']>;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

/** Contact details for a person, legal entity, venue or project */
export type ContactInfo = {
  __typename?: 'ContactInfo';
  contactUrl?: Maybe<Scalars['String']>;
  emailAddresses: Array<Scalars['String']>;
  phoneNumbers: Array<PhoneNumber>;
  postalAddresses: Array<Address>;
};

export enum ContactMedium {
  Asiointi = 'ASIOINTI',
  Email = 'EMAIL',
  MobileNotification = 'MOBILE_NOTIFICATION',
  Sms = 'SMS',
  SmsAndEmail = 'SMS_AND_EMAIL'
}

/**
 * Resources (media) that provide extra description of a resource,
 * facility, event or venue, such as images, videos, info pages, etc.
 */
export type DescriptionResources = {
  __typename?: 'DescriptionResources';
  externalLinks: Array<Scalars['String']>;
  infoUrls: Array<Scalars['String']>;
  mediaResources: Array<MediaResource>;
};

/**  Elasticsearch results  */
export type ElasticSearchResult = {
  __typename?: 'ElasticSearchResult';
  _shards?: Maybe<Shards>;
  hits?: Maybe<Hits>;
  timed_out?: Maybe<Scalars['Boolean']>;
  took?: Maybe<Scalars['Int']>;
};

/** Information about enrolled participant(s) in an event occurrence */
export type Enrolment = {
  __typename?: 'Enrolment';
  enroller?: Maybe<Person>;
  event?: Maybe<EventOccurrence>;
  extraInformation?: Maybe<Scalars['String']>;
  meta?: Maybe<NodeMeta>;
  overseerCount?: Maybe<Scalars['Int']>;
  overseers?: Maybe<Array<Person>>;
  participantCategory?: Maybe<Keyword>;
  participantCount: Scalars['Int'];
  participants?: Maybe<Array<Person>>;
  requestedMethodOfNotification?: Maybe<ContactMedium>;
  status?: Maybe<EnrolmentStatus>;
};

/** Rules about who can enroll to an event and how */
export type EnrolmentPolicy = {
  __typename?: 'EnrolmentPolicy';
  allowedParticipantCategories: Array<Keyword>;
  enrolmentTime?: Maybe<TimeDescription>;
  /** maximum number of people who can enrol together (at the same time) */
  maximumEnrolmentCount?: Maybe<Scalars['Int']>;
  meta?: Maybe<NodeMeta>;
  /** minimum number of people who can enrol together (at the same time) */
  minimumEnrolmentCount?: Maybe<Scalars['Int']>;
  participantMaximumAge: Scalars['Int'];
  participantMinimumAge: Scalars['Int'];
  type: Array<EnrolmentPolicyType>;
};

export enum EnrolmentPolicyType {
  Groups = 'GROUPS',
  GroupsWithSupervisors = 'GROUPS_WITH_SUPERVISORS',
  Individuals = 'INDIVIDUALS',
  NoEnrolmentNeeded = 'NO_ENROLMENT_NEEDED'
}

export enum EnrolmentStatus {
  Cancelled = 'CANCELLED',
  Confirmed = 'CONFIRMED',
  Declined = 'DECLINED',
  Queued = 'QUEUED',
  Requested = 'REQUESTED'
}

/**
 * Request for equipment - if someone needs equipment for a purpose such
 * as organising a volunteering event (as is the case in park cleaning
 * bees), a specification of what is being requested.
 */
export type EquipmentRequest = {
  __typename?: 'EquipmentRequest';
  deliveryLocation?: Maybe<LocationDescription>;
  estimatedAmount?: Maybe<Scalars['Int']>;
  extraInformation: Scalars['String'];
  meta?: Maybe<NodeMeta>;
  requestedEquipment: Scalars['String'];
  requestedForEvent?: Maybe<Event>;
  returnLocation?: Maybe<LocationDescription>;
};

/**
 * An organised event - something that happens at a specific time, has a
 * specific topic or content, and people can participate.  Examples include
 * meetups, concerts, volunteering occasions (or bees), happenings.  This
 * corresponds to Linked events/courses event, beta.kultus
 * PalvelutarjotinEventNode, Kukkuu event.
 */
export type Event = {
  __typename?: 'Event';
  contactPerson?: Maybe<LegalEntity>;
  description?: Maybe<LanguageString>;
  descriptionResources?: Maybe<DescriptionResources>;
  enrolmentPolicy?: Maybe<EnrolmentPolicy>;
  eventDataSource?: Maybe<Scalars['String']>;
  eventLanguages: Array<Language>;
  keywords: Array<Keyword>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  occurrences: Array<EventOccurrence>;
  organiser?: Maybe<LegalEntity>;
  pricing?: Maybe<Array<EventPricing>>;
  published?: Maybe<Scalars['DateTime']>;
  publisher?: Maybe<LegalEntity>;
  shortDescription?: Maybe<Scalars['String']>;
  subEvents: Array<Event>;
  superEvent?: Maybe<Event>;
  targetAudience?: Maybe<Array<Keyword>>;
};

export type EventOccurrence = {
  __typename?: 'EventOccurrence';
  /** for events where equipment is requested from the City of Helsinki */
  cityEquipmentRequests?: Maybe<Array<EquipmentRequest>>;
  currentlyAvailableParticipantCount?: Maybe<Scalars['Int']>;
  enrolments: Array<Enrolment>;
  /**
   * for information - for example, to guide people who are looking for
   * big or small events, or to give city officials a hint on how much
   * equipment is needed
   */
  estimatedAttendeeCount?: Maybe<Scalars['Int']>;
  happensAt?: Maybe<TimeDescription>;
  location?: Maybe<LocationDescription>;
  maximumAttendeeCount?: Maybe<Scalars['Int']>;
  meta?: Maybe<NodeMeta>;
  minimumAttendeeCount?: Maybe<Scalars['Int']>;
  /** which event this is an occurrence of */
  ofEvent?: Maybe<Event>;
  status?: Maybe<EventOccurrenceStatus>;
};

export enum EventOccurrenceStatus {
  Cancelled = 'CANCELLED',
  Postponed = 'POSTPONED',
  Published = 'PUBLISHED',
  Rescheduled = 'RESCHEDULED',
  Unpublished = 'UNPUBLISHED'
}

/** TODO: improve (a lot) over Linked events' offer type */
export type EventPricing = {
  __typename?: 'EventPricing';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

/** CRS object properties. */
export type GeoJsoncrsProperties = GeoJsonLinkedCrsProperties | GeoJsonNamedCrsProperties;

/** Enumeration of all GeoJSON CRS object types. */
export enum GeoJsoncrsType {
  Link = 'link',
  Name = 'name'
}

/** Coordinate Reference System (CRS) object. */
export type GeoJsonCoordinateReferenceSystem = {
  __typename?: 'GeoJSONCoordinateReferenceSystem';
  properties: GeoJsoncrsProperties;
  type: GeoJsoncrsType;
};

/** An object that links a geometry to properties in order to provide context. */
export type GeoJsonFeature = GeoJsonInterface & {
  __typename?: 'GeoJSONFeature';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  geometry?: Maybe<GeoJsonGeometryInterface>;
  id?: Maybe<Scalars['String']>;
  properties?: Maybe<Scalars['JSONObject']>;
  type: GeoJsonType;
};

/** A set of multiple features. */
export type GeoJsonFeatureCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONFeatureCollection';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  features: Array<GeoJsonFeature>;
  type: GeoJsonType;
};

/** A set of multiple geometries, possibly of various types. */
export type GeoJsonGeometryCollection = GeoJsonInterface & {
  __typename?: 'GeoJSONGeometryCollection';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  geometries: Array<GeoJsonGeometryInterface>;
  type: GeoJsonType;
};

export type GeoJsonGeometryInterface = {
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

export type GeoJsonInterface = {
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing a single connected sequence of geographical points. */
export type GeoJsonLineString = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONLineString';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Properties for link based CRS object. */
export type GeoJsonLinkedCrsProperties = {
  __typename?: 'GeoJSONLinkedCRSProperties';
  href: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

/** Object describing multiple connected sequences of geographical points. */
export type GeoJsonMultiLineString = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiLineString';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing multiple geographical points. */
export type GeoJsonMultiPoint = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiPoint';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing multiple shapes formed by sets of geographical points. */
export type GeoJsonMultiPolygon = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONMultiPolygon';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Properties for name based CRS object. */
export type GeoJsonNamedCrsProperties = {
  __typename?: 'GeoJSONNamedCRSProperties';
  name: Scalars['String'];
};

/** Object describing a single geographical point. */
export type GeoJsonPoint = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONPoint';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Object describing a single shape formed by a set of geographical points. */
export type GeoJsonPolygon = GeoJsonGeometryInterface & GeoJsonInterface & {
  __typename?: 'GeoJSONPolygon';
  bbox?: Maybe<Array<Maybe<Scalars['Float']>>>;
  coordinates?: Maybe<Scalars['GeoJSONCoordinates']>;
  crs: GeoJsonCoordinateReferenceSystem;
  type: GeoJsonType;
};

/** Enumeration of all GeoJSON object types. */
export enum GeoJsonType {
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection',
  GeometryCollection = 'GeometryCollection',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  MultiPoint = 'MultiPoint',
  MultiPolygon = 'MultiPolygon',
  Point = 'Point',
  Polygon = 'Polygon'
}

export type HitTotal = {
  __typename?: 'HitTotal';
  relation?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['Int']>;
};

export type Hits = {
  __typename?: 'Hits';
  hits?: Maybe<Array<Maybe<SingleHit>>>;
  max_score?: Maybe<Scalars['Float']>;
  total?: Maybe<HitTotal>;
};

export enum IdentificationStrength {
  /** If the person has authenticated with at least some method */
  Authenticated = 'AUTHENTICATED',
  /** If the person has done some identifiable action such as payment */
  Indirect = 'INDIRECT',
  /** If the person has proved their legal identity */
  LegallyConnected = 'LEGALLY_CONNECTED',
  /** If this person is just a pseudoperson for contacting */
  Nonidentifiable = 'NONIDENTIFIABLE',
  /** If the identity of this person is not known at all */
  Unidentified = 'UNIDENTIFIED'
}

export type Image = {
  __typename?: 'Image';
  caption?: Maybe<LanguageString>;
  url?: Maybe<Scalars['String']>;
};

/** TODO: merge all free tags, categories, and keywords */
export type Keyword = {
  __typename?: 'Keyword';
  name: Scalars['String'];
};

/** TODO: take from Profile or external source */
export enum Language {
  Fi = 'FI'
}

/** TODO: convert all String's to LanguageString's if linguistic content */
export type LanguageString = {
  __typename?: 'LanguageString';
  defaultLanguage?: Maybe<Language>;
  en?: Maybe<Scalars['String']>;
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
  text: Scalars['String'];
};

export type LegalEntity = Organisation | Person;

export type LinkedeventsPlace = {
  __typename?: 'LinkedeventsPlace';
  _at_context?: Maybe<Scalars['String']>;
  _at_id?: Maybe<Scalars['String']>;
  _at_type?: Maybe<Scalars['String']>;
  address_country?: Maybe<Scalars['String']>;
  address_locality?: Maybe<LinkedeventsPlaceLocalityString>;
  address_region?: Maybe<Scalars['String']>;
  contact_type?: Maybe<Scalars['String']>;
  created_time?: Maybe<Scalars['String']>;
  custom_data?: Maybe<Scalars['String']>;
  data_source?: Maybe<Scalars['String']>;
  deleted?: Maybe<Scalars['Boolean']>;
  description?: Maybe<LinkedeventsPlaceLocalityString>;
  divisions?: Maybe<Array<Maybe<LinkedeventsPlaceDivision>>>;
  email?: Maybe<Scalars['String']>;
  has_upcoming_events?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  info_url?: Maybe<LinkedeventsPlaceLocalityString>;
  last_modified_time?: Maybe<Scalars['String']>;
  n_events?: Maybe<Scalars['Int']>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
  /**  Raw Linkedevents Place fields  */
  origin?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  position?: Maybe<LinkedeventsPlacePosition>;
  post_office_box_num?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  replaced_by?: Maybe<Scalars['String']>;
  street_address?: Maybe<LinkedeventsPlaceLocalityString>;
  telephone?: Maybe<Scalars['String']>;
};

export type LinkedeventsPlaceDivision = {
  __typename?: 'LinkedeventsPlaceDivision';
  municipality?: Maybe<Scalars['String']>;
  name?: Maybe<LinkedeventsPlaceLocalityString>;
  ocd_id?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type LinkedeventsPlaceLocalityString = {
  __typename?: 'LinkedeventsPlaceLocalityString';
  en?: Maybe<Scalars['String']>;
  fi?: Maybe<Scalars['String']>;
  sv?: Maybe<Scalars['String']>;
};

export type LinkedeventsPlacePosition = {
  __typename?: 'LinkedeventsPlacePosition';
  coordinates?: Maybe<Array<Maybe<Scalars['Float']>>>;
  type?: Maybe<Scalars['String']>;
};

/** Free-form location, not necessarily at a know venue. */
export type LocationDescription = {
  __typename?: 'LocationDescription';
  address?: Maybe<Address>;
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  explanation?: Maybe<Scalars['String']>;
  geoLocation?: Maybe<GeoJsonFeature>;
  url?: Maybe<LanguageString>;
  venue?: Maybe<Venue>;
};

/** TODO: take this from Linked events Image type. */
export type MediaResource = {
  __typename?: 'MediaResource';
  meta?: Maybe<NodeMeta>;
  todo?: Maybe<Scalars['String']>;
};

export type NodeMeta = {
  __typename?: 'NodeMeta';
  createdAt?: Maybe<Scalars['DateTime']>;
  id: Scalars['ID'];
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type OntologyTree = {
  __typename?: 'OntologyTree';
  ancestorIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  childIds?: Maybe<Array<Maybe<Scalars['ID']>>>;
  id?: Maybe<Scalars['ID']>;
  level?: Maybe<Scalars['Int']>;
  name?: Maybe<LanguageString>;
  parentId?: Maybe<Scalars['ID']>;
};

export type OntologyWord = {
  __typename?: 'OntologyWord';
  id?: Maybe<Scalars['ID']>;
  label?: Maybe<LanguageString>;
};

export type Ontologyword = {
  __typename?: 'Ontologyword';
  can_add_clarification?: Maybe<Scalars['Boolean']>;
  can_add_schoolyear?: Maybe<Scalars['Boolean']>;
  extra_searchwords_fi?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  ontologyword_en?: Maybe<Scalars['String']>;
  ontologyword_fi?: Maybe<Scalars['String']>;
  ontologyword_sv?: Maybe<Scalars['String']>;
  unit_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
};

export type OpeningHours = {
  __typename?: 'OpeningHours';
  data?: Maybe<Array<Maybe<OpeningHoursDay>>>;
  is_open_now_url?: Maybe<Scalars['String']>;
  today?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
  url?: Maybe<Scalars['String']>;
};

export type OpeningHoursDay = {
  __typename?: 'OpeningHoursDay';
  date?: Maybe<Scalars['String']>;
  times?: Maybe<Array<Maybe<OpeningHoursTimes>>>;
};

export type OpeningHoursTimes = {
  __typename?: 'OpeningHoursTimes';
  endTime?: Maybe<Scalars['String']>;
  endTimeOnNextDay?: Maybe<Scalars['Boolean']>;
  fullDay?: Maybe<Scalars['Boolean']>;
  resourceState?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
};

export type OrderByDistance = {
  latitude: Scalars['Float'];
  longitude: Scalars['Float'];
  order?: InputMaybe<SortOrder>;
};

export type OrderByName = {
  order?: InputMaybe<SortOrder>;
};

/** TODO: merge beta.kultus organisation, etc */
export type Organisation = {
  __typename?: 'Organisation';
  contactDetails?: Maybe<ContactInfo>;
  meta?: Maybe<NodeMeta>;
};

export type PalvelukarttaUnit = {
  __typename?: 'PalvelukarttaUnit';
  accessibility_viewpoints?: Maybe<Scalars['String']>;
  address_city_en?: Maybe<Scalars['String']>;
  address_city_fi?: Maybe<Scalars['String']>;
  address_city_sv?: Maybe<Scalars['String']>;
  address_zip?: Maybe<Scalars['String']>;
  call_charge_info_en?: Maybe<Scalars['String']>;
  call_charge_info_fi?: Maybe<Scalars['String']>;
  call_charge_info_sv?: Maybe<Scalars['String']>;
  created_time?: Maybe<Scalars['String']>;
  data_source_url?: Maybe<Scalars['String']>;
  dept_id?: Maybe<Scalars['String']>;
  desc_en?: Maybe<Scalars['String']>;
  desc_fi?: Maybe<Scalars['String']>;
  desc_sv?: Maybe<Scalars['String']>;
  easting_etrs_gk25?: Maybe<Scalars['Int']>;
  easting_etrs_tm35fin?: Maybe<Scalars['Int']>;
  extra_searchwords_en?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  manual_coordinates?: Maybe<Scalars['Boolean']>;
  modified_time?: Maybe<Scalars['String']>;
  name_en?: Maybe<Scalars['String']>;
  name_fi?: Maybe<Scalars['String']>;
  name_sv?: Maybe<Scalars['String']>;
  northing_etrs_gk25?: Maybe<Scalars['Int']>;
  northing_etrs_tm35fin?: Maybe<Scalars['Int']>;
  ontologytree_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ontologyword_ids?: Maybe<Array<Maybe<Scalars['Int']>>>;
  ontologyword_ids_enriched?: Maybe<Array<Maybe<Ontologyword>>>;
  org_id?: Maybe<Scalars['String']>;
  organizer_name?: Maybe<Scalars['String']>;
  organizer_type?: Maybe<Scalars['String']>;
  /**  Raw palvelukartta Unit fields  */
  origin?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  picture_caption_en?: Maybe<Scalars['String']>;
  picture_caption_fi?: Maybe<Scalars['String']>;
  picture_caption_sv?: Maybe<Scalars['String']>;
  picture_url?: Maybe<Scalars['String']>;
  provider_type?: Maybe<Scalars['String']>;
  street_address_en?: Maybe<Scalars['String']>;
  street_address_fi?: Maybe<Scalars['String']>;
  street_address_sv?: Maybe<Scalars['String']>;
  www_en?: Maybe<Scalars['String']>;
  www_fi?: Maybe<Scalars['String']>;
  www_sv?: Maybe<Scalars['String']>;
};

/** TODO: take from Profile */
export type Person = {
  __typename?: 'Person';
  contactDetails?: Maybe<ContactInfo>;
  identificationStrength?: Maybe<IdentificationStrength>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<Scalars['String']>;
  preferredLanguages?: Maybe<Array<Language>>;
  preferredMedium?: Maybe<ContactMedium>;
};

export type PhoneNumber = {
  __typename?: 'PhoneNumber';
  countryCode: Scalars['String'];
  restNumber: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  administrativeDivisions?: Maybe<Array<Maybe<AdministrativeDivision>>>;
  ontologyTree?: Maybe<Array<Maybe<OntologyTree>>>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
  unifiedSearch?: Maybe<SearchResultConnection>;
  unifiedSearchCompletionSuggestions?: Maybe<SearchSuggestionConnection>;
};


export type QueryAdministrativeDivisionsArgs = {
  helsinkiCommonOnly?: InputMaybe<Scalars['Boolean']>;
};


export type QueryOntologyTreeArgs = {
  leavesOnly?: InputMaybe<Scalars['Boolean']>;
  rootId?: InputMaybe<Scalars['ID']>;
};


export type QueryOntologyWordsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']>>;
};


export type QueryUnifiedSearchArgs = {
  administrativeDivisionId?: InputMaybe<Scalars['ID']>;
  administrativeDivisionIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  index?: InputMaybe<Scalars['String']>;
  languages?: Array<UnifiedSearchLanguage>;
  last?: InputMaybe<Scalars['Int']>;
  ontology?: InputMaybe<Scalars['String']>;
  ontologyTreeId?: InputMaybe<Scalars['ID']>;
  ontologyTreeIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  ontologyWordIds?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  openAt?: InputMaybe<Scalars['String']>;
  orderByDistance?: InputMaybe<OrderByDistance>;
  orderByName?: InputMaybe<OrderByName>;
  q?: InputMaybe<Scalars['String']>;
};


export type QueryUnifiedSearchCompletionSuggestionsArgs = {
  index?: InputMaybe<Scalars['String']>;
  languages?: Array<UnifiedSearchLanguage>;
  prefix?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
};

export type RawJson = {
  __typename?: 'RawJSON';
  data?: Maybe<Scalars['String']>;
};

export type SearchResultConnection = {
  __typename?: 'SearchResultConnection';
  count?: Maybe<Scalars['Int']>;
  edges: Array<SearchResultEdge>;
  /**  Elasticsearch raw results  */
  es_results?: Maybe<Array<Maybe<ElasticSearchResult>>>;
  max_score?: Maybe<Scalars['Float']>;
  pageInfo?: Maybe<SearchResultPageInfo>;
};

export type SearchResultEdge = {
  __typename?: 'SearchResultEdge';
  cursor: Scalars['String'];
  node: SearchResultNode;
};

export type SearchResultNode = {
  __typename?: 'SearchResultNode';
  _score?: Maybe<Scalars['Float']>;
  event?: Maybe<Event>;
  id: Scalars['ID'];
  searchCategories: Array<UnifiedSearchResultCategory>;
  venue?: Maybe<Venue>;
};

export type SearchResultPageInfo = {
  __typename?: 'SearchResultPageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  startCursor?: Maybe<Scalars['String']>;
};

export type SearchSuggestionConnection = {
  __typename?: 'SearchSuggestionConnection';
  suggestions: Array<Maybe<Suggestion>>;
};

export type Shards = {
  __typename?: 'Shards';
  failed?: Maybe<Scalars['Int']>;
  skipped?: Maybe<Scalars['Int']>;
  successful?: Maybe<Scalars['Int']>;
  total?: Maybe<Scalars['Int']>;
};

export type SingleHit = {
  __typename?: 'SingleHit';
  _id?: Maybe<Scalars['String']>;
  _index?: Maybe<Scalars['String']>;
  _score?: Maybe<Scalars['Float']>;
  _source?: Maybe<RawJson>;
  _type?: Maybe<Scalars['String']>;
};

export enum SortOrder {
  Ascending = 'ASCENDING',
  Descending = 'DESCENDING'
}

export type Suggestion = {
  __typename?: 'Suggestion';
  label: Scalars['String'];
};

/** any kind of description answering the question "when". */
export type TimeDescription = {
  __typename?: 'TimeDescription';
  ending?: Maybe<Scalars['DateTime']>;
  otherTime?: Maybe<TimeDescription>;
  starting?: Maybe<Scalars['DateTime']>;
};

export enum UnifiedSearchLanguage {
  English = 'ENGLISH',
  Finnish = 'FINNISH',
  Swedish = 'SWEDISH'
}

export enum UnifiedSearchResultCategory {
  Article = 'ARTICLE',
  Artwork = 'ARTWORK',
  Enrollable = 'ENROLLABLE',
  Event = 'EVENT',
  PointOfInterest = 'POINT_OF_INTEREST',
  Reservable = 'RESERVABLE',
  Service = 'SERVICE'
}

/**
 * A place that forms a unit and can be used for some specific purpose -
 * respa unit or resource, service map unit, beta.kultus venue, linked
 * events place, Kukkuu venue
 */
export type Venue = {
  __typename?: 'Venue';
  accessibilityProfile?: Maybe<AccessibilityProfile>;
  additionalInfo?: Maybe<Scalars['String']>;
  arrivalInstructions?: Maybe<Scalars['String']>;
  contactDetails?: Maybe<ContactInfo>;
  description?: Maybe<LanguageString>;
  descriptionResources?: Maybe<DescriptionResources>;
  facilities?: Maybe<Array<VenueFacility>>;
  images?: Maybe<Array<Maybe<Image>>>;
  location?: Maybe<LocationDescription>;
  manager?: Maybe<LegalEntity>;
  meta?: Maybe<NodeMeta>;
  name?: Maybe<LanguageString>;
  ontologyWords?: Maybe<Array<Maybe<OntologyWord>>>;
  openingHours?: Maybe<OpeningHours>;
  partOf?: Maybe<Venue>;
  reservationPolicy?: Maybe<VenueReservationPolicy>;
};

/** TODO: combine beta.kultus Venue stuff with respa equipment type */
export type VenueFacility = {
  __typename?: 'VenueFacility';
  categories?: Maybe<Array<Keyword>>;
  meta?: Maybe<NodeMeta>;
  name: Scalars['String'];
};

/** TODO: this comes from respa resource/unit types */
export type VenueReservationPolicy = {
  __typename?: 'VenueReservationPolicy';
  todo?: Maybe<Scalars['String']>;
};

export type AdministrativeDivisionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AdministrativeDivisionsQuery = { __typename?: 'Query', administrativeDivisions?: Array<{ __typename?: 'AdministrativeDivision', id?: string | null | undefined, type?: string | null | undefined, name?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type OntologyTreeQueryVariables = Exact<{
  rootId?: InputMaybe<Scalars['ID']>;
}>;


export type OntologyTreeQuery = { __typename?: 'Query', ontologyTree?: Array<{ __typename?: 'OntologyTree', id?: string | null | undefined, name?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type OntologyWordsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
}>;


export type OntologyWordsQuery = { __typename?: 'Query', ontologyWords?: Array<{ __typename?: 'OntologyWord', id?: string | null | undefined, label?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined };

export type UnifiedSearchCompletionSuggestionsQueryVariables = Exact<{
  prefix?: InputMaybe<Scalars['String']>;
  language: UnifiedSearchLanguage;
}>;


export type UnifiedSearchCompletionSuggestionsQuery = { __typename?: 'Query', unifiedSearchCompletionSuggestions?: { __typename?: 'SearchSuggestionConnection', suggestions: Array<{ __typename?: 'Suggestion', label: string } | null | undefined> } | null | undefined };

export type SearchListQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  language: UnifiedSearchLanguage;
  administrativeDivisionIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  ontologyTreeIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  ontologyWordIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  openAt?: InputMaybe<Scalars['String']>;
  orderByDistance?: InputMaybe<OrderByDistance>;
  orderByName?: InputMaybe<OrderByName>;
}>;


export type SearchListQuery = { __typename?: 'Query', unifiedSearch?: { __typename?: 'SearchResultConnection', count?: number | null | undefined, pageInfo?: { __typename?: 'SearchResultPageInfo', endCursor?: string | null | undefined, hasNextPage: boolean } | null | undefined, edges: Array<{ __typename?: 'SearchResultEdge', node: { __typename?: 'SearchResultNode', venue?: { __typename?: 'Venue', meta?: { __typename?: 'NodeMeta', id: string } | null | undefined, name?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined, description?: { __typename?: 'LanguageString', fi?: string | null | undefined } | null | undefined, images?: Array<{ __typename?: 'Image', url?: string | null | undefined } | null | undefined> | null | undefined, openingHours?: { __typename?: 'OpeningHours', today?: Array<{ __typename?: 'OpeningHoursTimes', startTime?: string | null | undefined, endTime?: string | null | undefined, endTimeOnNextDay?: boolean | null | undefined, fullDay?: boolean | null | undefined, resourceState?: string | null | undefined } | null | undefined> | null | undefined, data?: Array<{ __typename?: 'OpeningHoursDay', date?: string | null | undefined, times?: Array<{ __typename?: 'OpeningHoursTimes', startTime?: string | null | undefined, endTime?: string | null | undefined, endTimeOnNextDay?: boolean | null | undefined, fullDay?: boolean | null | undefined, resourceState?: string | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined, location?: { __typename?: 'LocationDescription', address?: { __typename?: 'Address', postalCode?: string | null | undefined, streetAddress?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined, city?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined } | null | undefined, geoLocation?: { __typename?: 'GeoJSONFeature', geometry?: { __typename?: 'GeoJSONLineString', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiLineString', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiPoint', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiPolygon', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONPoint', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONPolygon', coordinates?: any | null | undefined } | null | undefined } | null | undefined } | null | undefined, ontologyWords?: Array<{ __typename?: 'OntologyWord', id?: string | null | undefined, label?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined } | null | undefined> | null | undefined } | null | undefined } }> } | null | undefined };

export type SearchMapQueryVariables = Exact<{
  q?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  after?: InputMaybe<Scalars['String']>;
  language: UnifiedSearchLanguage;
  administrativeDivisionIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  ontologyTreeIds?: InputMaybe<Array<Scalars['ID']> | Scalars['ID']>;
  openAt?: InputMaybe<Scalars['String']>;
  orderByDistance?: InputMaybe<OrderByDistance>;
  orderByName?: InputMaybe<OrderByName>;
}>;


export type SearchMapQuery = { __typename?: 'Query', unifiedSearch?: { __typename?: 'SearchResultConnection', count?: number | null | undefined, edges: Array<{ __typename?: 'SearchResultEdge', node: { __typename?: 'SearchResultNode', venue?: { __typename?: 'Venue', meta?: { __typename?: 'NodeMeta', id: string } | null | undefined, name?: { __typename?: 'LanguageString', fi?: string | null | undefined, sv?: string | null | undefined, en?: string | null | undefined } | null | undefined, location?: { __typename?: 'LocationDescription', geoLocation?: { __typename?: 'GeoJSONFeature', geometry?: { __typename?: 'GeoJSONLineString', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiLineString', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiPoint', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONMultiPolygon', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONPoint', coordinates?: any | null | undefined } | { __typename?: 'GeoJSONPolygon', coordinates?: any | null | undefined } | null | undefined } | null | undefined } | null | undefined } | null | undefined } }> } | null | undefined };


export const AdministrativeDivisionsDocument = gql`
    query AdministrativeDivisions {
  administrativeDivisions(helsinkiCommonOnly: true) {
    id
    type
    name {
      fi
      sv
      en
    }
  }
}
    `;

/**
 * __useAdministrativeDivisionsQuery__
 *
 * To run a query within a React component, call `useAdministrativeDivisionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAdministrativeDivisionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAdministrativeDivisionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useAdministrativeDivisionsQuery(baseOptions?: Apollo.QueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>(AdministrativeDivisionsDocument, options);
      }
export function useAdministrativeDivisionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>(AdministrativeDivisionsDocument, options);
        }
export type AdministrativeDivisionsQueryHookResult = ReturnType<typeof useAdministrativeDivisionsQuery>;
export type AdministrativeDivisionsLazyQueryHookResult = ReturnType<typeof useAdministrativeDivisionsLazyQuery>;
export type AdministrativeDivisionsQueryResult = Apollo.QueryResult<AdministrativeDivisionsQuery, AdministrativeDivisionsQueryVariables>;
export const OntologyTreeDocument = gql`
    query OntologyTree($rootId: ID) {
  ontologyTree(rootId: $rootId, leavesOnly: true) {
    id
    name {
      fi
      sv
      en
    }
  }
}
    `;

/**
 * __useOntologyTreeQuery__
 *
 * To run a query within a React component, call `useOntologyTreeQuery` and pass it any options that fit your needs.
 * When your component renders, `useOntologyTreeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOntologyTreeQuery({
 *   variables: {
 *      rootId: // value for 'rootId'
 *   },
 * });
 */
export function useOntologyTreeQuery(baseOptions?: Apollo.QueryHookOptions<OntologyTreeQuery, OntologyTreeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OntologyTreeQuery, OntologyTreeQueryVariables>(OntologyTreeDocument, options);
      }
export function useOntologyTreeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OntologyTreeQuery, OntologyTreeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OntologyTreeQuery, OntologyTreeQueryVariables>(OntologyTreeDocument, options);
        }
export type OntologyTreeQueryHookResult = ReturnType<typeof useOntologyTreeQuery>;
export type OntologyTreeLazyQueryHookResult = ReturnType<typeof useOntologyTreeLazyQuery>;
export type OntologyTreeQueryResult = Apollo.QueryResult<OntologyTreeQuery, OntologyTreeQueryVariables>;
export const OntologyWordsDocument = gql`
    query OntologyWords($ids: [ID!]) {
  ontologyWords(ids: $ids) {
    id
    label {
      fi
      sv
      en
    }
  }
}
    `;

/**
 * __useOntologyWordsQuery__
 *
 * To run a query within a React component, call `useOntologyWordsQuery` and pass it any options that fit your needs.
 * When your component renders, `useOntologyWordsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOntologyWordsQuery({
 *   variables: {
 *      ids: // value for 'ids'
 *   },
 * });
 */
export function useOntologyWordsQuery(baseOptions?: Apollo.QueryHookOptions<OntologyWordsQuery, OntologyWordsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OntologyWordsQuery, OntologyWordsQueryVariables>(OntologyWordsDocument, options);
      }
export function useOntologyWordsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OntologyWordsQuery, OntologyWordsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OntologyWordsQuery, OntologyWordsQueryVariables>(OntologyWordsDocument, options);
        }
export type OntologyWordsQueryHookResult = ReturnType<typeof useOntologyWordsQuery>;
export type OntologyWordsLazyQueryHookResult = ReturnType<typeof useOntologyWordsLazyQuery>;
export type OntologyWordsQueryResult = Apollo.QueryResult<OntologyWordsQuery, OntologyWordsQueryVariables>;
export const UnifiedSearchCompletionSuggestionsDocument = gql`
    query UnifiedSearchCompletionSuggestions($prefix: String, $language: UnifiedSearchLanguage!) {
  unifiedSearchCompletionSuggestions(
    prefix: $prefix
    index: "location"
    languages: [$language]
  ) {
    suggestions {
      label
    }
  }
}
    `;

/**
 * __useUnifiedSearchCompletionSuggestionsQuery__
 *
 * To run a query within a React component, call `useUnifiedSearchCompletionSuggestionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUnifiedSearchCompletionSuggestionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUnifiedSearchCompletionSuggestionsQuery({
 *   variables: {
 *      prefix: // value for 'prefix'
 *      language: // value for 'language'
 *   },
 * });
 */
export function useUnifiedSearchCompletionSuggestionsQuery(baseOptions: Apollo.QueryHookOptions<UnifiedSearchCompletionSuggestionsQuery, UnifiedSearchCompletionSuggestionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UnifiedSearchCompletionSuggestionsQuery, UnifiedSearchCompletionSuggestionsQueryVariables>(UnifiedSearchCompletionSuggestionsDocument, options);
      }
export function useUnifiedSearchCompletionSuggestionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UnifiedSearchCompletionSuggestionsQuery, UnifiedSearchCompletionSuggestionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UnifiedSearchCompletionSuggestionsQuery, UnifiedSearchCompletionSuggestionsQueryVariables>(UnifiedSearchCompletionSuggestionsDocument, options);
        }
export type UnifiedSearchCompletionSuggestionsQueryHookResult = ReturnType<typeof useUnifiedSearchCompletionSuggestionsQuery>;
export type UnifiedSearchCompletionSuggestionsLazyQueryHookResult = ReturnType<typeof useUnifiedSearchCompletionSuggestionsLazyQuery>;
export type UnifiedSearchCompletionSuggestionsQueryResult = Apollo.QueryResult<UnifiedSearchCompletionSuggestionsQuery, UnifiedSearchCompletionSuggestionsQueryVariables>;
export const SearchListDocument = gql`
    query SearchList($q: String, $first: Int, $after: String, $language: UnifiedSearchLanguage!, $administrativeDivisionIds: [ID!], $ontologyTreeIds: [ID!], $ontologyWordIds: [ID!], $openAt: String, $orderByDistance: OrderByDistance, $orderByName: OrderByName) {
  unifiedSearch(
    q: $q
    index: "location"
    first: $first
    after: $after
    languages: [$language]
    administrativeDivisionIds: $administrativeDivisionIds
    ontologyTreeIds: $ontologyTreeIds
    ontologyWordIds: $ontologyWordIds
    openAt: $openAt
    orderByDistance: $orderByDistance
    orderByName: $orderByName
  ) {
    count
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        venue {
          meta {
            id
          }
          name {
            fi
            sv
            en
          }
          description {
            fi
          }
          images {
            url
          }
          openingHours {
            today {
              startTime
              endTime
              endTimeOnNextDay
              fullDay
              resourceState
            }
            data {
              date
              times {
                startTime
                endTime
                endTimeOnNextDay
                fullDay
                resourceState
              }
            }
          }
          location {
            address {
              streetAddress {
                fi
                sv
                en
              }
              postalCode
              city {
                fi
                sv
                en
              }
            }
            geoLocation {
              geometry {
                coordinates
              }
            }
          }
          ontologyWords {
            id
            label {
              fi
              sv
              en
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useSearchListQuery__
 *
 * To run a query within a React component, call `useSearchListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchListQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      language: // value for 'language'
 *      administrativeDivisionIds: // value for 'administrativeDivisionIds'
 *      ontologyTreeIds: // value for 'ontologyTreeIds'
 *      ontologyWordIds: // value for 'ontologyWordIds'
 *      openAt: // value for 'openAt'
 *      orderByDistance: // value for 'orderByDistance'
 *      orderByName: // value for 'orderByName'
 *   },
 * });
 */
export function useSearchListQuery(baseOptions: Apollo.QueryHookOptions<SearchListQuery, SearchListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchListQuery, SearchListQueryVariables>(SearchListDocument, options);
      }
export function useSearchListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchListQuery, SearchListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchListQuery, SearchListQueryVariables>(SearchListDocument, options);
        }
export type SearchListQueryHookResult = ReturnType<typeof useSearchListQuery>;
export type SearchListLazyQueryHookResult = ReturnType<typeof useSearchListLazyQuery>;
export type SearchListQueryResult = Apollo.QueryResult<SearchListQuery, SearchListQueryVariables>;
export const SearchMapDocument = gql`
    query SearchMap($q: String, $first: Int, $after: String, $language: UnifiedSearchLanguage!, $administrativeDivisionIds: [ID!], $ontologyTreeIds: [ID!], $openAt: String, $orderByDistance: OrderByDistance, $orderByName: OrderByName) {
  unifiedSearch(
    q: $q
    index: "location"
    first: $first
    after: $after
    languages: [$language]
    administrativeDivisionIds: $administrativeDivisionIds
    ontologyTreeIds: $ontologyTreeIds
    openAt: $openAt
    orderByDistance: $orderByDistance
    orderByName: $orderByName
  ) {
    count
    edges {
      node {
        venue {
          meta {
            id
          }
          name {
            fi
            sv
            en
          }
          location {
            geoLocation {
              geometry {
                coordinates
              }
            }
          }
        }
      }
    }
  }
}
    `;

/**
 * __useSearchMapQuery__
 *
 * To run a query within a React component, call `useSearchMapQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchMapQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchMapQuery({
 *   variables: {
 *      q: // value for 'q'
 *      first: // value for 'first'
 *      after: // value for 'after'
 *      language: // value for 'language'
 *      administrativeDivisionIds: // value for 'administrativeDivisionIds'
 *      ontologyTreeIds: // value for 'ontologyTreeIds'
 *      openAt: // value for 'openAt'
 *      orderByDistance: // value for 'orderByDistance'
 *      orderByName: // value for 'orderByName'
 *   },
 * });
 */
export function useSearchMapQuery(baseOptions: Apollo.QueryHookOptions<SearchMapQuery, SearchMapQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchMapQuery, SearchMapQueryVariables>(SearchMapDocument, options);
      }
export function useSearchMapLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchMapQuery, SearchMapQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchMapQuery, SearchMapQueryVariables>(SearchMapDocument, options);
        }
export type SearchMapQueryHookResult = ReturnType<typeof useSearchMapQuery>;
export type SearchMapLazyQueryHookResult = ReturnType<typeof useSearchMapLazyQuery>;
export type SearchMapQueryResult = Apollo.QueryResult<SearchMapQuery, SearchMapQueryVariables>;