import { AnyObject, Context } from "../../../../types";

export default interface VenueEnricher<I = AnyObject, O = AnyObject> {
  getEnrichments(data: I, context: Context): Promise<Partial<O>>;
}
