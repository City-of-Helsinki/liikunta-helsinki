import { Source } from "../../../../types";
import VenueResolverInstruction from "./VenueResolverIntegration";

type Config = {
  getId: (id: string, source: Source) => string;
};

export default class HaukiIntegration extends VenueResolverInstruction {
  constructor(config: Config) {
    super({
      getDataSources: (id, source, { dataSources }) => {
        const haukiId = config.getId(id, source);

        return [
          dataSources.hauki.getIsOpen(haukiId).then((result) => ({
            isOpen: result,
          })),
          dataSources.hauki.getOpeningHours(haukiId).then((result) => ({
            openingHours: result,
          })),
        ];
      },
    });
  }
}
