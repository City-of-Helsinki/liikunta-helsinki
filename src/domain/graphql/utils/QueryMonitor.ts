import { Logger } from "../../logger";

export default class QueryMonitor {
  startTime: Date;
  threshold: number;
  logger: Logger;
  name: string;

  constructor(logger: Logger, name: string, threshold = 1000) {
    this.startTime = new Date();
    this.threshold = threshold;
    this.logger = logger;
    this.name = name;
  }

  end() {
    const now = new Date();
    const approximateQueryTime = now.getTime() - this.startTime.getTime();

    if (approximateQueryTime > this.threshold) {
      this.logger.warn(
        `Query "${this.name}" took approximately ${approximateQueryTime}ms (threshold at ${this.threshold}ms)`
      );
    }
  }
}
