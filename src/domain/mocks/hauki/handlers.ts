import { rest } from "msw";

import openingHoursMock from "./openingHours.mock";
import isOpenNowMock from "./isOpenNow.mock";

const baseUrl = "https://hauki.api.hel.fi/v1";

const handlers = [
  rest.get(`${baseUrl}/resource/:id/opening_hours`, (_, res, ctx) => {
    return res(ctx.json(openingHoursMock));
  }),
  rest.get(`${baseUrl}/resource/:id/is_open_now`, (_, res, ctx) => {
    return res(ctx.json(isOpenNowMock));
  }),
];

export default handlers;
