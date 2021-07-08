import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { dataSourceLogger as defaultLogger, Logger } from "../../logger";

export default abstract class DataSource {
  logger: Logger;

  constructor(logger = defaultLogger) {
    this.logger = logger;
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    try {
      this.logger.debug(`Starting request\n
      URL: ${url}
      CONFIG: ${config}\n`);
      const response = await axios.get<T>(url, config);
      this.logger.debug(`Request succeeded\n
      URL: ${url}
      CONFIG: ${config}\n`);

      return response;
    } catch (e) {
      this.logger.error(`Failed Request\n
      URL: ${url}
      CONFIG: ${config}
      ERROR: ${e}\n`);
      return e.response;
    }
  }
}
