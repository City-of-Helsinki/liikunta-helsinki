import { pick } from "lodash";

import { VenueDetails } from "../../types";

export default function formatResponseObject(
  obj,
  source: string
): VenueDetails {
  switch (source) {
    case "linked":
      return pick(obj, [
        "data_source",
        "email",
        "contact_type",
        "postal_code",
        "image",
        "address_locality",
        "position",
        "description",
        "name",
        "info_url",
        "street_address",
        "telephone",
      ]) as VenueDetails;
    case "tprek":
      return {
        id: obj.id,
        data_source: obj?.sources[0]?.source ?? null,
        email: null,
        postal_code: obj.address_zip,
        image: null,
        position: {
          type: "Point",
          coordinates: [obj.latitude, obj.longitude],
        },
        description: null,
        name: {
          fi: obj.name_fi ?? "",
          en: obj.name_en ?? "",
          sv: obj.name_sv ?? "",
        },
        street_address: {
          fi: obj.street_address_fi ?? "",
          en: obj.street_address_en ?? "",
          sv: obj.street_address_sv ?? "",
        },
        address_locality: {
          fi: obj.address_city_fi ?? "",
          en: obj.address_city_en ?? "",
          sv: obj.address_city_sv ?? "",
        },
        contact_type: null,
        info_url: null,
        telephone: null,
      } as VenueDetails;
    default:
      return obj;
  }
}
