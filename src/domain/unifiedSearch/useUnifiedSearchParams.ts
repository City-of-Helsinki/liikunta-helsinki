import useRouter from "../i18n/router/useRouter";
import { UnifiedSearchParameters } from "./types";

function stringifyQueryValue(value?: string | string[]): string | undefined {
  if (!value) {
    return;
  }

  return Array.isArray(value) ? value.join(",") : value;
}

function parseNumber(value?: string | string[]): number | undefined {
  if (!value || Array.isArray(value)) {
    return;
  }

  return Number(value);
}

function dropUndefined(obj: Record<string, unknown>) {
  const objectWithoutUndefined = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    objectWithoutUndefined[key] = value;
  });

  return objectWithoutUndefined;
}

export default function useUnifiedSearchParameters(): UnifiedSearchParameters {
  const {
    query: { q, administrativeDivisionId, after, first },
  } = useRouter();

  return dropUndefined({
    q: stringifyQueryValue(q),
    administrativeDivisionId: stringifyQueryValue(administrativeDivisionId),
    after: stringifyQueryValue(after),
    first: parseNumber(first),
  });
}
