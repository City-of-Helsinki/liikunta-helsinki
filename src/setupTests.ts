import { TextEncoder, TextDecoder } from "util";

import "@testing-library/jest-dom/extend-expect";
import { loadEnvConfig } from "@next/env";

import { server } from "./domain/mocks/server";
import "./tests/initI18n";

loadEnvConfig(process.cwd());

global.fetch = jest.fn();

jest.mock("next-i18next", () => ({
  // When testing, i18n is set up with providers instead of the version that's
  // optimized for next. That's why we replace the next useTranslation with the
  // default react version.
  useTranslation: jest.requireActual("react-i18next").useTranslation,
}));

// To avoid error: ReferenceError: TextEncoder is not defined
// discusssed here: https://github.com/jsdom/jsdom/issues/2524
global.TextEncoder = TextEncoder;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

global.IntersectionObserver = class IntersectionObserver {
  readonly root: Element | Document | null;
  readonly rootMargin: string;
  readonly thresholds: ReadonlyArray<number>;

  constructor() {
    // pass
  }

  disconnect() {
    return null;
  }

  observe() {
    return null;
  }

  takeRecords() {
    return null;
  }

  unobserve() {
    return null;
  }
};

// Mock depended services with msw
beforeAll(() => {
  // Enable the mocking in tests.
  server.listen();
});
afterEach(() => {
  // Reset any runtime handlers tests may use.
  server.resetHandlers();
});
afterAll(() => {
  // Clean up once the tests are done.
  server.close();
});
