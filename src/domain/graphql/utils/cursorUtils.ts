export function createCursor<T>(query: T): string {
  return Buffer.from(JSON.stringify(query)).toString("base64");
}

export function readCursor<T>(cursor: string | null): T {
  if (!cursor) {
    return null;
  }

  return JSON.parse(Buffer.from(cursor, "base64").toString("utf8")) as T;
}
