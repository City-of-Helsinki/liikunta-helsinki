import { dataSourceTprekLogger as logger } from "../../logger";
import DataSource from "./DataSource";

type AnyObject = Record<string, unknown>;

class Tprek extends DataSource {
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

  private async getAllOntologyWords() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await this.get<any>(
      `http://www.hel.fi/palvelukarttaws/rest/v4/ontologyword/`
    );

    if (res.statusText !== "OK") {
      return null;
    }

    return res.data;
  }

  private async getOntologyTrees() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await this.get<any>(
      `http://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/`
    );

    if (res.statusText !== "OK") {
      return null;
    }

    return res.data;
  }
}

export default new Tprek(logger);
