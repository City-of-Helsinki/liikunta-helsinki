import { rest } from "msw";

import mockUnit from "./unit.mock";
import mockOntologytree from "./ontologytree.mock";
import mockOntologyword from "./ontologyword.mock";

const baseUrl = "http://www.hel.fi/palvelukarttaws/rest/v4";

const handlers = [
  rest.get(`${baseUrl}/unit/:id`, (_, res, ctx) => {
    return res(ctx.json(mockUnit));
  }),
  rest.get(`${baseUrl}/ontologyword`, (_, res, ctx) => {
    return res(ctx.json(mockOntologyword));
  }),
  rest.get(`${baseUrl}/ontologytree`, (_, res, ctx) => {
    return res(ctx.json(mockOntologytree));
  }),
];

export default handlers;
