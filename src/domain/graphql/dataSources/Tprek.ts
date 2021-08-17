import { dataSourceTprekLogger as logger } from "../../logger";
import RESTDataSource from "./RESTDataSource";

type AnyObject = Record<string, unknown>;

export default class Tprek extends RESTDataSource {
  constructor() {
    super(logger);
    this.baseURL = "http://www.hel.fi/palvelukarttaws/rest/v4";
  }

  async getOntologyTree(ids: number[]): Promise<AnyObject[] | null> {
    const trees = await this.getOntologyTrees();

    if (!trees) {
      return null;
    }

    return ids.map((id) => trees.find((tree) => id === tree.id));
  }

  async getOntologyWords(ids: number[]): Promise<AnyObject[] | null> {
    const words = await this.getAllOntologyWords();

    if (!words) {
      return null;
    }

    return ids.map((id) => words.find((word) => id === word.id));
  }

  async getUnit(id: string) {
    return this.get(`unit/${id}`);
  }

  private async getAllOntologyWords() {
    return this.get(`ontologyword/`);
  }

  private async getOntologyTrees() {
    return this.get(`ontologytree/`);
  }
}
