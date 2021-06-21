/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

const logger = {
  error: (...args: any[]) => console.error("error - ", ...args),
  info: (...args: any[]) => console.info("info - ", ...args),
  debug: (...args: any[]) => console.debug("debug - ", ...args),
};

export default logger;
