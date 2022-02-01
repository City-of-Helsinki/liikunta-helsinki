import get from "lodash/get";

import { Locale } from "../../../../types";
import {
  Context,
  Point,
  TranslationsObject,
  VenueDetails,
} from "../../../../types";

export const formTranslationObject = (obj, field) => {
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

export const formAccessibilitySentences = (data) => {
  const translationsLanguages = ["fi", "en", "sv"];
  const table = { fi: [], en: [], sv: [] };

  translationsLanguages.forEach((language) => {
    data?.accessibility_sentences?.forEach((group) => {
      const key = `sentence_group_${language}`;
      const groupValue = group[key];

      const existing = table[language].find(
        (obj) => obj?.groupName === groupValue
      );
      if (!existing) {
        table[language].push({
          groupName: groupValue,
          sentences: [group[`sentence_${language}`]],
        });
      } else {
        const index = table[language].indexOf(existing);
        table[language][index].sentences.push(group[`sentence_${language}`]);
      }
    });
  });
  return table;
};

export function getTprekId(source = "tprek", id: string): string | null {
  if (!source || !id) {
    return null;
  }

  return [source, id].join(":");
}

export function getPointFromLongAndLat(long: number, lat: number): Point {
  if (!long || !lat) {
    return null;
  }

  return {
    type: "Point",
    coordinates: [long, lat],
  };
}

function pickLocale(obj: TranslationsObject, locale: Locale) {
  return get(obj, locale, null);
}

export function translateVenue(
  data: Partial<VenueDetails>,
  { language }: Context
): VenueDetails | VenueDetails<string> {
  if (!language) {
    return data as VenueDetails;
  }

  return {
    ...data,
    addressLocality: pickLocale(data.addressLocality, language),
    description: pickLocale(data.description, language),
    name: pickLocale(data.name, language),
    streetAddress: pickLocale(data.streetAddress, language),
    infoUrl: pickLocale(data.infoUrl, language),
    telephone: pickLocale(data.telephone, language),
    accessibilitySentences:
      // If grouped by translations, find the correct one by language
      "fi" in data.accessibilitySentences
        ? get(data.accessibilitySentences, language, null)
        : data.accessibilitySentences,
    connections: data.connections.map((connection) => ({
      ...connection,
      name: pickLocale(connection.name, language),
    })),
  } as VenueDetails<string>;
}
