import React from "react";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
// eslint-disable-next-line no-restricted-imports
import { I18nextProvider } from "react-i18next";

import i18n from "./initI18n";

const mockRouter: NextRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  replace: jest.fn(() => Promise.resolve(true)),
  back: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: true,
  isPreview: false,
  isReady: true,
  locale: "fi",
  defaultLocale: "fi",
};

type Props = {
  mocks?: ReadonlyArray<MockedResponse>;
  children: React.ReactNode;
  router?: Partial<NextRouter>;
};

function TestProviders({ mocks, children, router }: Props) {
  return (
    <I18nextProvider i18n={i18n}>
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        <MockedProvider mocks={mocks} addTypename={false}>
          {children}
        </MockedProvider>
      </RouterContext.Provider>
    </I18nextProvider>
  );
}

export default TestProviders;
