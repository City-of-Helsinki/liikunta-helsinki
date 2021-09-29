import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Locale } from "../../config";

const COMMON_TRANSLATIONS = [
  "common",
  "navigation",
  "footer",
  "card",
  "info_block",
  "date_time_picker",
  "geolocation_provider",
];

export default async function serverSideTranslationsWithCommon(
  locale: Locale,
  namespaces: string[] = []
) {
  return serverSideTranslations(locale, [
    ...COMMON_TRANSLATIONS,
    ...namespaces,
  ]);
}
