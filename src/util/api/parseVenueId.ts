import { Source } from "../../types";

const SUPPORTED_SOURCES: string[] = ["tprek", "linked"];

export class IdParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IdParseError";
  }
}

export default function parseVenueId(
  venueId: string | string[]
): [Source, string] | null {
  if (Array.isArray(venueId)) {
    throw Error("Array IDs are not supported");
  }

  const [source, id] = venueId.split(":");

  if (!source) {
    throw new IdParseError("Could not find source from venue id");
  }

  if (!SUPPORTED_SOURCES.includes(source)) {
    throw new IdParseError(`Found unsupported source from venue id: ${source}`);
  }

  if (!id) {
    throw new IdParseError("Could not find id from venue id");
  }

  return [source as Source, id];
}
