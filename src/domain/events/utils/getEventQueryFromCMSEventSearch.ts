export default function getEventQueryFromCMSEventSearch(url: string) {
  const params = new URL(url).searchParams;
  const { super_event_type, ...restOfQuery } = Object.fromEntries(params);

  return {
    ...restOfQuery,
    superEventType: super_event_type,
  };
}
