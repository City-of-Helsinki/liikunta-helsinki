import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { Language } from "../../types";

function getLanguageAwarePath(
  locale: string,
  defaultLocale: string,
  path: string
) {
  if (locale === defaultLocale) {
    return path;
  }

  return `/${locale}${path}`;
}

type Props = {
  languages: Language[];
};

function RouteMeta({ languages }: Props) {
  const { locale, defaultLocale, asPath } = useRouter();
  const canonical = getLanguageAwarePath(locale, defaultLocale, asPath);
  const currentLanguageAndLocale = languages.find(
    (language) => language.slug === locale
  )?.locale;

  return (
    <Head>
      <link rel="canonical" href={canonical} />
      {languages.map((language) => (
        <link
          key={language.id}
          rel="alternate"
          hrefLang={language.locale}
          href={getLanguageAwarePath(language.slug, defaultLocale, asPath)}
        />
      ))}
      <link rel="alternate" hrefLang="x-default" href={asPath} />
      <meta property="og:locale" content={currentLanguageAndLocale} />
      <meta property="og:url" content={canonical} />
    </Head>
  );
}

export default RouteMeta;
