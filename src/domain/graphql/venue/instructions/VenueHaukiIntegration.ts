import { Source } from "../../../../types";
import hauki from "../../dataSources/hauki";
import VenueResolverInstruction from "./VenueResolverIntegration";

type Config = {
  getId: (id: string, source: Source) => string;
};

export default class HaukiIntegration extends VenueResolverInstruction {
  constructor(config: Config) {
    super({
      getDataSources: (id, source) => {
        const haukiId = config.getId(id, source);

        return [
          hauki.getIsOpen(haukiId).then((result) => ({
            isOpen: result,
          })),
          hauki.getOpeningHours(haukiId).then((result) => ({
            openingHours: result,
          })),
        ];
      },
    });
  }
}
