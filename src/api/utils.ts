import { Connection } from "../types";

export function getNodes<T>(connection: Connection<T>): T[] {
  return connection.edges.map(({ node }) => node);
}
