import { camelCase, mapKeys, pick, rearg } from "lodash";

import { VenueDetails } from "../../types";

const toCamelCase = (obj) => {
  return mapKeys(obj, rearg(camelCase, 1));
};

export default function formatResponseObject(
  obj,
  source: string
): VenueDetails {
  switch (source) {
    case "linked":
      const linked = pick(obj, [
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
      ]);
      return toCamelCase(linked) as VenueDetails;
    case "tprek":
      return {
        id: obj.id,
        dataSource: obj?.sources[0]?.source ?? null,
        email: null,
        postalCode: obj.address_zip,
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
        streetAddress: {
          fi: obj.street_address_fi ?? "",
          en: obj.street_address_en ?? "",
          sv: obj.street_address_sv ?? "",
        },
        addressLocality: {
          fi: obj.address_city_fi ?? "",
          en: obj.address_city_en ?? "",
          sv: obj.address_city_sv ?? "",
        },
        contactType: null,
        infoUrl: null,
        telephone: null,
      } as VenueDetails;
    default:
      return obj;
  }
}
