import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import formatResponseObject from "../../../util/api/formatResponseObject";
import getSourceUrl from "../../../util/api/getSourceUrl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { venueId } = req.query;
  const [source, id] = (venueId as string).split(":");

  if (!source || !id) {
    res.status(400).json({ msg: "Invalid ID parameter" });
  }

  try {
    const url = getSourceUrl(source, id);
    const response = await axios.get(url);
    const formattedResponse = formatResponseObject(response.data, source);

    res.status(200).json(formattedResponse);
  } catch (e) {
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
