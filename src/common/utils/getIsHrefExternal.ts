import AppConfig from "../../domain/app/AppConfig";
import getIsValidUrl from "./getIsValidUrl";

export default function getIsHrefExternal(href: string): boolean {
  if (getIsValidUrl(href)) {
    const appOrigin = new URL(AppConfig.nextApiGraphqlEndpoint).origin;
    const hrefOrigin = new URL(href).origin;

    return appOrigin !== hrefOrigin;
  }

  // If href is not a valid url, assume that it is not external. When href is
  // not a valid url, it can be:
  // a relative path: /fi/article-title
  // a have unsupported protocol: weirdProtocol://domain.fi/fi/article-title
  // be otherwise malformed: https:|/domain.fi/fi/article-title
  return false;
}
