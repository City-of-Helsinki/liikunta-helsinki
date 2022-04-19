import Router from "next/router";
import {
  ApolloLink,
  execute,
  gql,
  Observable,
  throwServerError,
} from "@apollo/client";

import { networkLogger } from "../../../domain/logger";
import apolloErrorLink from "../apolloErrorLink";

const MockQuery = gql`
  query {
    foo
  }
`;
const routerPushSpy = jest
  .spyOn(Router, "push")
  .mockImplementation(() => Promise.resolve(true));
const networkLoggerSpy = jest
  .spyOn(networkLogger, "error")
  .mockImplementation(() => {
    // pass
  });

let processBrowser;

beforeEach(() => {
  processBrowser = process.browser;

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.browser = true;
});

afterEach(() => {
  routerPushSpy.mockClear();
  networkLoggerSpy.mockClear();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.browser = processBrowser;
});

test("should redirect to /error on network error", (done) => {
  const mockLink = new ApolloLink(
    () =>
      new Observable(() => {
        throwServerError(
          { status: 500, ok: false } as Response,
          "ServerError",
          "app is crashing"
        );
      })
  );

  execute(apolloErrorLink.concat(mockLink), { query: MockQuery }).subscribe({
    error: () => {
      expect(routerPushSpy).toHaveBeenCalledWith("/error");
      done();
    },
  });
});

test("should log network errors", (done) => {
  const mockLink = new ApolloLink(
    () =>
      new Observable(() => {
        throwServerError(
          { status: 500, ok: false } as Response,
          "ServerError",
          "app is crashing"
        );
      })
  );

  execute(apolloErrorLink.concat(mockLink), { query: MockQuery }).subscribe({
    error: () => {
      expect(networkLoggerSpy).toHaveBeenCalledTimes(1);
      expect(networkLoggerSpy.mock.calls[0]).toMatchInlineSnapshot(`
Array [
  [ServerError: app is crashing],
]
`);
      done();
    },
  });
});
