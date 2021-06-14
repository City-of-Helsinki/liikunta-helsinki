import { camelCase, mapKeys, pick, rearg } from "lodash";

import { VenueDetails } from "../../types";

const toCamelCase = (obj) => {
  return mapKeys(obj, rearg(camelCase, 1));
};

const formTranslationObject = (obj, field) => {
  const translationsLanguages = ["fi", "en", "sv"];
  const [field_fi, field_en, field_sv] = translationsLanguages.map(
    (language) => `${field}_${language}`
  );
  if (!obj[field_fi] && !obj[field_en] && !obj[field_sv]) return null;
  return {
    ...(obj[field_fi] && { fi: obj[field_fi] }),
    ...(obj[field_en] && { en: obj[field_en] }),
    ...(obj[field_sv] && { sv: obj[field_sv] }),
  };
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
        id: [
          (obj?.sources && obj.sources[0]?.source) ?? "tprek",
          obj.id ?? null,
        ].join(":"),
        dataSource: (obj?.sources && obj?.sources[0]?.source) ?? "tprek",
        email: obj.email ?? null,
        postalCode: obj.address_zip,
        image: obj.picture_url ?? null,
        position: {
          type: "Point",
          coordinates: [obj.longitude, obj.latitude],
        },
        description: formTranslationObject(obj, "desc"),
        name: formTranslationObject(obj, "name"),
        streetAddress: formTranslationObject(obj, "street_address"),
        addressLocality: formTranslationObject(obj, "address_city"),
        infoUrl: formTranslationObject(obj, "www"),
        telephone: obj.phone ?? null,
      } as VenueDetails;
    default:
      break;
  }
}
