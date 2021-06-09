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
        "id",
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
        id: [obj?.sources[0]?.source, obj.id].join(":"),
        dataSource: obj?.sources[0]?.source ?? null,
        email: null,
        postalCode: obj.address_zip,
        image: null,
        position: {
          type: "Point",
          coordinates: [obj.longitude, obj.latitude],
        },
        description: null,
        name: {
          ...(obj.name_fi && { fi: obj.name_fi }),
          ...(obj.name_en && { en: obj.name_en }),
          ...(obj.name_sv && { sv: obj.name_sv }),
        },
        streetAddress: {
          ...(obj.street_address_fi && { fi: obj.street_address_fi }),
          ...(obj.street_address_en && { en: obj.street_address_en }),
          ...(obj.street_address_sv && { sv: obj.street_address_sv }),
        },
        addressLocality: {
          ...(obj.address_city_fi && { fi: obj.address_city_fi }),
          ...(obj.address_city_en && { en: obj.address_city_en }),
          ...(obj.address_city_sv && { sv: obj.address_city_sv }),
        },
        contactType: null,
        infoUrl: null,
        telephone: null,
      } as VenueDetails;
    default:
      break;
  }
}
