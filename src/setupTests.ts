import "@testing-library/jest-dom/extend-expect";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

global.fetch = jest.fn();
