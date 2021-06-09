export default function getSourceUrl(source: string, id: string) {
  switch (source) {
    case "linked":
      const linkedId = `tprek:${id}`;
      return `https://api.hel.fi/linkedevents/v1/place/${linkedId}/`;
    case "tprek":
      return `https://www.hel.fi/palvelukarttaws/rest/v4/unit/${id}/`;
    default:
      break;
  }
}
