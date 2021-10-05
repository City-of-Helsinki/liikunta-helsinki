import { format } from "date-fns";

// https://hds.hel.fi/guidelines/data-formats
export default function formatDateTimeIntoLocaleString(date: Date): string {
  return format(date, "d.M.yyyy HH:mm");
}
