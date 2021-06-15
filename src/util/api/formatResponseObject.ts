import get from "lodash/get";

import { Locale } from "../../config";
import { Point, Source, TranslationsObject, VenueDetails } from "../../types";

const formTranslationObject = (obj, field) => {
  const translationsLanguages = ["fi", "en", "sv"];
  const [field_fi, field_en, field_sv] = translationsLanguages.map(
    (language) => `${field}_${language}`
  );
  if (!obj[field_fi] && !obj[field_en] && !obj[field_sv]) return null;

  return {
    fi: obj[field_fi] ?? null,
    en: obj[field_en] ?? null,
    sv: obj[field_sv] ?? null,
  };
};

function getLinkedVenue(obj): VenueDetails {
  return {
    id: obj?.id ?? null,
    dataSource: obj?.data_source ?? null,
    email: obj?.email ?? null,
    postalCode: obj?.postal_code ?? null,
    image: obj?.image ?? null,
    addressLocality: obj?.address_locality ?? null,
    position: obj?.position ?? null,
    description: obj?.description ?? null,
    name: obj?.name ?? null,
    infoUrl: obj?.info_url ?? null,
    streetAddress: obj?.street_address ?? null,
    telephone: obj?.telephone ?? null,
  };
}

function getTprekId(source = "tprek", id: string): string | null {
  if (!source || !id) {
    return null;
  }

  return [source, id].join(":");
}

function getPointFromLongAndLat(long: number, lat: number): Point {
  if (!long || !lat) {
    return null;
  }

  return {
    type: "Point",
    coordinates: [long, lat],
  };
}

function getTprekVenue(obj): VenueDetails {
  return {
    id: getTprekId(obj?.sources?.[0]?.source, obj?.id),
    dataSource: obj?.sources?.[0]?.source ?? "tprek",
    email: obj?.email ?? null,
    postalCode: obj?.address_zip ?? null,
    image: obj?.picture_url ?? null,
    position: getPointFromLongAndLat(obj.longitude, obj.latitude),
    description: formTranslationObject(obj, "desc"),
    name: formTranslationObject(obj, "name"),
    streetAddress: formTranslationObject(obj, "street_address"),
    addressLocality: formTranslationObject(obj, "address_city"),
    infoUrl: formTranslationObject(obj, "www"),
    telephone: obj?.phone ?? null,
  };
}

function getVenueDetails(obj, source: Source) {
  switch (source) {
    case "linked":
      return getLinkedVenue(obj);
    case "tprek":
      return getTprekVenue(obj);
  }
}

function pickLocale(obj: TranslationsObject, locale: Locale) {
  return get(obj, locale, null);
}

export default function formatResponseObject(
  obj,
  source: Source,
  locale?: Locale | false
): VenueDetails | VenueDetails<string> {
  const venueDetails = getVenueDetails(obj, source);

  if (!locale) {
    return venueDetails;
  }

  return {
    ...venueDetails,
    addressLocality: pickLocale(venueDetails.addressLocality, locale),
    description: pickLocale(venueDetails.description, locale),
    name: pickLocale(venueDetails.name, locale),
    streetAddress: pickLocale(venueDetails.streetAddress, locale),
    infoUrl: pickLocale(venueDetails.infoUrl, locale),
  };
}
