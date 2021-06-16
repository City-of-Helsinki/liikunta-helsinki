import axios from "axios";

import { Source } from "../../types";
import { Locale } from "../../config";
import formatResponseObject from "./formatResponseObject";
import getSourceUrl from "./getSourceUrl";

const SUPPORTED_SOURCES: string[] = ["tprek", "linked"];

class IdParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IdParseError";
  }
}

function parseVenueId(venueId: string | string[]): [Source, string] | null {
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

export default async function resolveVenue(venueId: string, language: Locale) {
  try {
    const [source, id] = parseVenueId(venueId);
    const url = getSourceUrl(source, id);
    const response = await axios.get(url);
    const formattedResponse = formatResponseObject(
      response.data,
      source,
      language
    );

    return formattedResponse;
  } catch (e) {
    if (e instanceof IdParseError) {
      throw Error("Invalid ID parameter");
    }

    throw Error("Internal Server Error");
  }
}
