import { TextEncoder, TextDecoder } from "util";

import "@testing-library/jest-dom/extend-expect";
import { loadEnvConfig } from "@next/env";

import { server } from "./domain/mocks/server";

loadEnvConfig(process.cwd());

global.fetch = jest.fn();

// https://react.i18next.com/misc/testing
jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () =>
          new Promise(() => {
            // pass
          }),
      },
    };
  },
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
