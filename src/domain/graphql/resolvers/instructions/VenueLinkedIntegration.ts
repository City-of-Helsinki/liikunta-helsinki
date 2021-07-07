import axios from "axios";

import { AnyObject, VenueDetails } from "../../../../types";
import { translateVenue } from "./utils";
import VenueEnricher from "./VenueEnricher";
import VenueResolverIntegration from "./VenueResolverIntegration";

type Config = {
  enrichers?: VenueEnricher[];
};

export default class VenueLinkedIntegration extends VenueResolverIntegration {
  constructor(config: Config) {
    super({
      getDataSources: (id: string) => {
        const linkedId = `tprek:${id}`;

        return [
          axios
            .get(`https://api.hel.fi/linkedevents/v1/place/${linkedId}/`)
            .then((response) => response.data),
        ];
      },
      enrichers: config.enrichers,
      format: (data, context) => translateVenue(this.formatter(data), context),
    });
  }

  private formatter(data: AnyObject): VenueDetails {
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
    } as VenueDetails;
  }
}
