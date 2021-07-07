import { AnyObject, Context } from "../../../../types";

export default interface VenueEnricher {
  getEnrichments(data: AnyObject, context: Context): Promise<AnyObject>;
}
