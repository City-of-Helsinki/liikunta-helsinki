export default function getVenueIdParts(idWithSource: string) {
  if (!idWithSource.includes(":")) {
    throw Error("ID is not correctly formatted");
  }

  const [source, id] = idWithSource.split(":");

  return { source, id };
}
