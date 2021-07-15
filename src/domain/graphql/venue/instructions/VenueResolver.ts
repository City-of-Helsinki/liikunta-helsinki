import { AnyObject, Context, Source, VenueDetails } from "../../../../types";
import VenueResolverIntegration from "./VenueResolverIntegration";

type Config = {
  integrations: VenueResolverIntegration[];
  merge?: (data: AnyObject[]) => AnyObject;
};

export default class VenueResolver {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async resolveVenue(
    id: string,
    source: Source,
    context: Context
  ): Promise<VenueDetails> {
    const data = await this.execute(this.config.integrations, [
      id,
      source,
      context,
    ]);

    return this.merge(data) as VenueDetails;
  }

  private async execute(
    integrations: VenueResolverIntegration[],
    [id, source, context]: [string, Source, Context]
  ) {
    const dataPromisesWithFormatting = integrations.flatMap((integration) => {
      const dataLocations = integration.getDataSources(id, source, context);

      return dataLocations.map((dataLocation) => {
        return dataLocation.then((data) =>
          this.processData(data as AnyObject, integration, context)
        );
      });
    });

    return Promise.all(dataPromisesWithFormatting);
  }

  private async processData(
    data: AnyObject,
    integration: VenueResolverIntegration,
    context: Context
  ) {
    const formattedData = integration.format(data, context);
    const enrichments = await integration.enrich(data, context);

    return {
      ...formattedData,
      ...enrichments,
    };
  }

  private merge(data: AnyObject[]): AnyObject {
    if (this.config.merge) {
      return this.config.merge(data);
    }

    return data.reduce(
      (acc, dataObject) => ({
        ...acc,
        ...dataObject,
      }),
      {}
    );
  }
}
