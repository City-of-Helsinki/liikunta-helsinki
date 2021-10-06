import { UrlObject } from "url";

import React from "react";
import NextLink, { LinkProps } from "next/link";

import useRouter from "./useRouter";
import { getI18nPath, stringifyUrlObject } from "./utils";
import { Locale } from "../../../config";

function getI18nHref(
  href: string | UrlObject,
  locale: Locale
): string | UrlObject | null {
  if (typeof href === "string") {
    // If the href is a string we are not able to confidently unpack the href
    // into routes and params.
    return null;
  }

  return {
    ...href,
    pathname: getI18nPath(href.pathname, locale),
  };
}

function getHrefThatAvoidsEscaping(
  href: string | UrlObject | null
): string | null {
  if (!href || typeof href === "string") {
    // If the href is a string it won't be unescaped
    return null;
  }

  return stringifyUrlObject(href);
}

type Props = React.PropsWithChildren<Omit<LinkProps, "locale">> & {
  avoidEscaping?: true;
  locale?: Locale | false;
};

export default function Link({ href, avoidEscaping, ...delegated }: Props) {
  const router = useRouter();
  const locale = delegated.locale || router.locale;
  const i18nHref = getI18nHref(href, locale) ?? href;
  const enhancedHref = avoidEscaping
    ? getHrefThatAvoidsEscaping(i18nHref) ?? i18nHref
    : i18nHref;

  return <NextLink {...delegated} href={enhancedHref} />;
}
