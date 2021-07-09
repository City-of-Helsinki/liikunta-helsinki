import React from "react";
import { resolveHref } from "next/dist/next-server/lib/router/router";
import NextLink, { LinkProps } from "next/link";

import useRouter from "../../domain/i18nRouter/useRouter";
import { getI18nAsPath } from "./utils";

export default function Link({
  as: overrideAs,
  ...delegated
}: React.PropsWithChildren<LinkProps>) {
  const router = useRouter();
  // Typedefinitions were incorrect
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [resolvedHref] = resolveHref(router, delegated.href, true);
  const locale = delegated.locale || router.locale;
  const as = overrideAs ?? getI18nAsPath(resolvedHref, locale) ?? undefined;

  return <NextLink {...delegated} as={as} />;
}
