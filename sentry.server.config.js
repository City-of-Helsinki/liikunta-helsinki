// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const TRACES_SAMPLE_RATE = process.env.NEXT_PUBLIC_SENTRY_TRACE_SAMPLE_RATE;
const SENTRY_ENVIRONMENRT = process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT;

if (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === "1") {
  if (!SENTRY_DSN) {
    throw new Error("SENTRY_DSN env variable missing");
  }
  if (!TRACES_SAMPLE_RATE) {
    throw new Error("TRACES_SAMPLE_RATE env variable missing");
  }
  if (!SENTRY_ENVIRONMENRT) {
    throw new Error("SENTRY_ENVIRONMENRT env variable missing");
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: TRACES_SAMPLE_RATE ? parseFloat(TRACES_SAMPLE_RATE) : 0,
    environment: SENTRY_ENVIRONMENRT,
  });
} else {
  // eslint-disable-next-line no-console
  console.log(
    "Sentry environment missing. Add NEXT_PUBLIC_SENTRY_ENVIRONMENT env variables if you want to enabled Sentry"
  );
}
