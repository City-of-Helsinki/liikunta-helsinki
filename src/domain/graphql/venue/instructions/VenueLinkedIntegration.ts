import axios from "axios";

import { VenueDetails } from "../../../../types";
import { translateVenue } from "./utils";
import VenueEnricher from "./VenueEnricher";
import VenueResolverIntegration from "./VenueResolverIntegration";

type LinkedTranslationObject = {
  fi: string | null;
  sv: string | null;
  en: string | null;
} | null;

type LinkedDivision = {
  type: string;
  ocd_id: string;
  municipality: string | null;
  // Seems that this translation may behave differently than the rest.
  name: {
    fi: string;
    sv?: string;
    en?: string;
  };
};

type LinkedPoint = {
  type: "Point";
  coordinates: [number, number];
};

type LinkedPlace = {
  id: string;
  data_source: string | null;
  publisher: string | null;
  divisions: LinkedDivision[];
  created_time: string;
  last_modified_time: string;
  custom_data: unknown | null;
  email: string | null;
  address_region: string | null;
  postal_code: string | null;
  post_office_box_num: string | null;
  address_country: string | null;
  deleted: boolean;
  has_upcoming_events: boolean;
  n_events: number;
  image: string | null;
  parent: string | null;
  replaced_by: string | null;
  position: LinkedPoint;
  address_locality: LinkedTranslationObject;
  description: LinkedTranslationObject;
  name: LinkedTranslationObject;
  info_url: LinkedTranslationObject;
  street_address: LinkedTranslationObject;
  telephone: LinkedTranslationObject;
  "@id": string;
  "@context": string;
  "@type": string;
};

type Config = {
  enrichers?: VenueEnricher[];
};

export default class VenueLinkedIntegration extends VenueResolverIntegration<LinkedPlace> {
  constructor(config: Config) {
    super({
      getDataSources: (id: string, _, { dataSources }) => {
        const linkedId = `tprek:${id}`;

        return [dataSources.linked.getPlace(linkedId)];
      },
      enrichers: config.enrichers,
      format: (data, context) => translateVenue(this.formatter(data), context),
    });
  }

  private formatter(data: LinkedPlace): Partial<VenueDetails> {
    return {
      id: data?.id ?? null,
      dataSource: data?.data_source ?? null,
      email: data?.email ?? null,
      postalCode: data?.postal_code ?? null,
      image: data?.image ?? null,
      addressLocality: data?.address_locality ?? null,
      position: data?.position ?? null,
      description: data?.description ?? null,
      name: data?.name ?? null,
      infoUrl: data?.info_url ?? null,
      streetAddress: data?.street_address ?? null,
      telephone: data?.telephone ?? null,
    };
  }
}
