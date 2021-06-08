import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

import formatResponseObject from "../../../util/api/formatResponseObject";
import getSourceUrl from "../../../util/api/getSourceUrl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { venueId } = req.query;
  const splitVenueId = (venueId as string).split(":");
  const source = splitVenueId[0];
  const id = splitVenueId[1];

  const url = getSourceUrl(source, id);
  const response = await axios.get(url);
  const formattedResponse = formatResponseObject(response.data, source);
  res.status(200).json(formattedResponse);
}
