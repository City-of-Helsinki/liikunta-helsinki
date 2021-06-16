import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MockedResponse } from "@apollo/client/testing";
import { NextRouter } from "next/router";

import TestProviders from "./TestProviders";

const customRender = (
  ui: ReactElement,
  mocks?: MockedResponse[],
  router?: Partial<NextRouter>,
  options?: RenderOptions
) =>
  render(ui, {
    wrapper: ({ children }) => (
      <TestProviders mocks={mocks} router={router}>
        {children}
      </TestProviders>
    ),
    ...options,
  });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
