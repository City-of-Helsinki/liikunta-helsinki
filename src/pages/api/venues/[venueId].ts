import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import accepts from "accepts";

import Config from "../../../config";
import formatResponseObject from "../../../util/api/formatResponseObject";
import getSourceUrl from "../../../util/api/getSourceUrl";
import { Source } from "../../../types";

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

function acceptsLanguages(
  req: NextApiRequest,
  languages: string[]
): typeof languages[number] | false {
  const accept = accepts(req);

  return accept.languages(languages);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { venueId } = req.query;
  const language = acceptsLanguages(req, Config.locales);

  try {
    const [source, id] = parseVenueId(venueId);
    const url = getSourceUrl(source, id);
    const response = await axios.get(url);
    const formattedResponse = formatResponseObject(
      response.data,
      source,
      language
    );

    return res.status(200).json(formattedResponse);
  } catch (e) {
    if (e instanceof IdParseError) {
      return res.status(400).json({ message: "Invalid ID parameter" });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
}
