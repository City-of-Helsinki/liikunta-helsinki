import { Locale } from "../../config";

export default function formatDateTimeIntoLocaleString(
  date: Date,
  locale: Locale
): string {
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
