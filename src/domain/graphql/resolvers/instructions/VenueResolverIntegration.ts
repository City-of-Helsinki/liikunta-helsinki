import { Source, AnyObject, Context } from "../../../../types";
import VenueEnricher from "./VenueEnricher";

type Config = {
  getDataSources?: (id: string, source: Source) => Promise<unknown>[];
  format?: (data: AnyObject, context: Context) => AnyObject;
  enrichers?: VenueEnricher[];
};

export default class VenueResolverIntegration<
  I extends AnyObject = AnyObject,
  O extends AnyObject = AnyObject
> {
  config: Config;

  constructor(config?: Config) {
    this.config = config;
  }

  getDataSources(id: string, source: Source): Promise<unknown>[] {
    if (!this.config.getDataSources) {
      return [];
    }

    return this.config.getDataSources(id, source);
  }

  format(uncleanData: I, context: Context): O {
    if (this.config.format) {
      return this.config.format(uncleanData, context) as O;
    }

    return uncleanData as O;
  }

  async enrich(data: AnyObject, context: Context): Promise<AnyObject> {
    const enrichers =
      this.config.enrichers?.map((enricher) =>
        enricher.getEnrichments(data, context)
      ) ?? [];
    const enrichmentDataArray = await Promise.all(enrichers);
    const enrichmentData = enrichmentDataArray.reduce(
      (acc, data) => ({
        ...acc,
        ...data,
      }),
      {}
    );

    return enrichmentData;
  }
}
