import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { dataSourceLogger as defaultLogger } from "../../logger";

export default abstract class DataSource {
  logger;

  constructor(logger = defaultLogger) {
    this.logger = logger;
  }

  async get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      this.logger.debug(`Requesting ${url}`);
      const response = await axios.get(url, config);
      this.logger.debug(`Request succeeded ${url}`);

      return response;
    } catch (e) {
      this.logger.error(`Failed Request (${url}): ${e.message}`);
      return e.response;
    }
  }
}
