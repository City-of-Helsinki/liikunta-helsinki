import "@testing-library/jest-dom/extend-expect";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

global.fetch = jest.fn();

// https://react.i18next.com/misc/testing
jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
}));
