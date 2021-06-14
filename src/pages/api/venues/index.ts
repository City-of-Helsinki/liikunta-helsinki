import { NextApiRequest, NextApiResponse } from "next";

// This "empty" route is required for Nextjs to find /api/venues/venueId endpoint
// https://nextjs.org/docs/api-routes/dynamic-api-routes#index-routes-and-dynamic-api-routes
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(400).json({ message: "Invalid ID parameter" });
}
