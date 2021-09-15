import { VenueDetails } from "../../../../types";
import {
  translateVenue,
  formTranslationObject,
  getPointFromLongAndLat,
  getTprekId,
  formAccessibilitySentences,
} from "./utils";
import VenueEnricher from "./VenueEnricher";
import VenueResolverIntegration from "./VenueResolverIntegration";

type TprekUnitSource = {
  source: string;
  id: string;
};

type TprekUnitOntologywordDetails = {
  id: number;
  // Some fields are likely missing from this type.
};

type TprekUnitServiceDescriptions = {
  id: number;
  available_languages: string[];
};

// No clear type information was available so all of the fields are marked as
// optional besides the ID. Some may in fact be required.
export type TprekUnit = {
  id: number;
  org_id?: string;
  dept_id?: string;
  provider_type?: string;
  data_source_url?: string;
  name_fi: string;
  name_sv?: string;
  name_en?: string;
  ontologyword_ids?: number[];
  ontologytree_ids?: number[];
  sources?: TprekUnitSource[];
  latitude?: number;
  longitude?: number;
  northing_etrs_gk25?: number;
  easting_etrs_gk25?: number;
  northing_etrs_tm35fin?: number;
  easting_etrs_tm35fin?: number;
  manual_coordinates?: boolean;
  street_address_fi?: string;
  street_address_sv?: string;
  street_address_en?: string;
  address_zip?: string;
  address_city_fi?: string;
  address_city_sv?: string;
  address_city_en?: string;
  accessibility_viewpoints?: string;
  created_time: string;
  modified_time: string;
  connections: Array<unknown>;
  ontologyword_details: TprekUnitOntologywordDetails[];
  service_descriptions: TprekUnitServiceDescriptions[];
  accessibility_sentences: Array<unknown>;
  email?: string;
  phone?: string;
  picture_url?: string;
};

type Config = {
  enrichers: VenueEnricher[];
};

export default class VenueTprekIntegration extends VenueResolverIntegration<TprekUnit> {
  constructor(config: Config) {
    super({
      getDataSources: (id: string, _, { dataSources }) => [
        dataSources.tprek.getUnit(id),
      ],
      enrichers: config.enrichers,
      format: (data, context) => translateVenue(this.formatter(data), context),
    });
  }

  formatter(data: TprekUnit): Partial<VenueDetails> {
    return {
      id: getTprekId(data?.sources?.[0]?.source, data?.id?.toString()),
      dataSource: data?.sources?.[0]?.source ?? "tprek",
      email: data?.email ?? null,
      postalCode: data?.address_zip ?? null,
      image: data?.picture_url ?? null,
      position: getPointFromLongAndLat(data.longitude, data.latitude),
      description: formTranslationObject(data, "desc"),
      name: formTranslationObject(data, "name"),
      streetAddress: formTranslationObject(data, "street_address"),
      addressLocality: formTranslationObject(data, "address_city"),
      infoUrl: formTranslationObject(data, "www"),
      accessibilitySentences: formAccessibilitySentences(data),
      telephone: {
        fi: data?.phone ?? null,
        sv: data?.phone ?? null,
        en: data?.phone ?? null,
      },
    };
  }
}
