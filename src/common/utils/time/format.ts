import { format } from "date-fns";

// Check recommended formats: https://hds.hel.fi/guidelines/data-formats

export function formatIntoDateTime(date: Date): string {
  return format(date, "d.M.yyyy HH:mm");
}

export function formatIntoDate(date: Date): string {
  return format(date, "d.M.yyyy");
}
