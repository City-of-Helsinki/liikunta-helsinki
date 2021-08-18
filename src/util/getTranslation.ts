import { Locale } from "../config";
import { LocalizedString } from "../types";

export default function getTranslation(
  translation: LocalizedString,
  locale: Locale
) {
  return translation[locale] ?? translation.fi;
}
