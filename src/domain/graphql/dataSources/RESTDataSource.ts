import {
  RequestOptions,
  Request,
  Response,
  RESTDataSource as ApolloRESTDataSource,
} from "apollo-datasource-rest";

import { dataSourceLogger as defaultLogger, Logger } from "../../logger";

export default abstract class RESTDataSource extends ApolloRESTDataSource {
  logger: Logger;

  constructor(logger = defaultLogger) {
    super();
    this.logger = logger;
  }

  protected willSendRequest(request: RequestOptions) {
    this.logger.debug(`Starting request\n
      URL: ${request.path}${request.params ? `?${request.params}` : ""}\n`);
  }

  protected didEncounterError(error: Error, _request: Request) {
    this.logger.error(`Failed Request\n
      URL: ${_request.url}
      ERROR: ${error}\n`);

    super.didEncounterError(error, _request);
  }

  protected didReceiveResponse(response: Response, _request: Request) {
    this.logger.debug(`Request succeeded\n
      URL: ${_request.url}\n`);

    return super.didReceiveResponse(response, _request);
  }

  protected async trace<TResult>(
    request: Request,
    fn: () => Promise<TResult>
  ): Promise<TResult> {
    if (process && process.env && process.env.NODE_ENV === "development") {
      const startTime = Date.now();
      try {
        return await fn();
      } finally {
        const duration = Date.now() - startTime;
        const label = `${request.method || "GET"} ${request.url}`;
        this.logger.debug(`Tracing: ${label} (${duration}ms)`);
      }
    } else {
      return fn();
    }
  }
}
