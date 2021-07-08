import { Context } from "../../../../types";
import tprek from "../../dataSources/tprek";
import VenueEnricher from "./VenueEnricher";
import { VenueData } from "./VenueResolverIntegration";
import { TprekUnit } from "./VenueTprekIntegration";

export default class VenueOntologyEnricher
  implements VenueEnricher<TprekUnit, VenueData> {
  async getEnrichments(
    {
      ontologytree_ids: ontologyTreeIds,
      ontologyword_ids: ontologyWordIds,
    }: TprekUnit,
    { language }: Context
  ): Promise<Partial<VenueData>> {
    const enrichDataLocations = [];

    if (ontologyTreeIds && Array.isArray(ontologyTreeIds)) {
      enrichDataLocations.push(
        tprek.getOntologyTree(ontologyTreeIds).then((ontologyTree) =>
          ontologyTree?.map((tree) => {
            const labels = {
              fi: tree.name_fi,
              sv: tree.name_sv,
              en: tree.name_en,
            };
            const label = language ? labels[language] : labels;

            return {
              id: tree.id,
              label,
            };
          })
        )
      );
    }

    if (ontologyWordIds && Array.isArray(ontologyWordIds)) {
      enrichDataLocations.push(
        tprek.getOntologyWords(ontologyWordIds).then((ontologyWords) =>
          ontologyWords?.map((word) => {
            const labels = {
              fi: word.ontologyword_fi,
              sv: word.ontologyword_sv,
              en: word.ontologyword_en,
            };
            const label = language ? labels[language] : labels;

            return {
              id: word.id,
              label,
            };
          })
        )
      );
    }

    const [ontologyTree = [], ontologyWords = []] = await Promise.all(
      enrichDataLocations
    );

    return { ontologyTree, ontologyWords };
  }
}
