import axios from "axios";

import { Locale } from "../../config";
import formatResponseObject from "./formatResponseObject";
import getSourceUrl from "./getSourceUrl";
import parseVenueId, { IdParseError } from "./parseVenueId";

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
