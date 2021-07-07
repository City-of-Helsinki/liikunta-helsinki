import axios from "axios";

import { AnyObject, VenueDetails } from "../../../../types";
import {
  translateVenue,
  formTranslationObject,
  getPointFromLongAndLat,
  getTprekId,
} from "./utils";
import VenueEnricher from "./VenueEnricher";
import VenueResolverIntegration from "./VenueResolverIntegration";

type Config = {
  enrichers: VenueEnricher[];
};

export default class VenueTprekIntegration extends VenueResolverIntegration {
  constructor(config: Config) {
    super({
      getDataSources: (id: string) => [
        axios
          .get(`https://www.hel.fi/palvelukarttaws/rest/v4/unit/${id}`)
          .then((response) => response.data),
      ],
      enrichers: config.enrichers,
      format: (data, context) => translateVenue(this.formatter(data), context),
    });
  }

  formatter(data: AnyObject): VenueDetails {
    return {
      id: getTprekId(data?.sources?.[0]?.source, data?.id as string | null),
      dataSource: data?.sources?.[0]?.source ?? "tprek",
      email: data?.email ?? null,
      postalCode: data?.address_zip ?? null,
      image: data?.picture_url ?? null,
      position: getPointFromLongAndLat(
        data.longitude as number,
        data.latitude as number
      ),
      description: formTranslationObject(data, "desc"),
      name: formTranslationObject(data, "name"),
      streetAddress: formTranslationObject(data, "street_address"),
      addressLocality: formTranslationObject(data, "address_city"),
      infoUrl: formTranslationObject(data, "www"),
      telephone: data?.phone ?? null,
      ontologyWords: data?.ontologyWords,
      ontologyTree: data?.ontologyTree,
    } as VenueDetails;
  }
}
