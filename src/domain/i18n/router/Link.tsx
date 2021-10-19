import { UrlObject } from "url";

import React from "react";
import NextLink, { LinkProps } from "next/link";

import useRouter from "./useRouter";
import { getI18nPath, stringifyUrlObject } from "./utils";
import { Locale } from "../../../config";

function getI18nHref(href: UrlObject, locale: Locale, defaultPathname: string) {
  return {
    ...href,
    pathname: getI18nPath(href.pathname, locale) ?? defaultPathname,
  };
}

function getHrefThatAvoidsEscaping(href: UrlObject | null) {
  return stringifyUrlObject(href);
}

type Props = React.PropsWithChildren<Omit<LinkProps, "locale">> & {
  escape?: boolean;
  locale?: Locale | false;
};

export default function Link({ href, escape, ...delegated }: Props) {
  const router = useRouter();

  // Use string hrefs as is
  if (typeof href === "string") {
    return <NextLink {...delegated} href={href} />;
  }

  const locale = delegated.locale || router.locale;
  const i18nHref = getI18nHref(href, locale, router.pathname) ?? href;
  const enhancedHref = escape
    ? i18nHref
    : getHrefThatAvoidsEscaping(i18nHref) ?? i18nHref;

  return <NextLink {...delegated} href={enhancedHref} />;
}
