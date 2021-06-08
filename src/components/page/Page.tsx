import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

import { getMenuLocationFromLanguage } from "../../api/utils";
import DefaultLayout from "../layout/Layout";
import { LayoutComponent } from "../layout/types";
import PageMeta from "../meta/PageMeta";

export const PAGE_FRAGMENT = gql`
  fragment PageFragment on RootQuery {
    pageLanguages: languages {
      id
      name
      slug
      code
      locale
    }
    pageMenus: menus(where: { location: $menuLocation }) {
      nodes {
        id
        menuItems {
          nodes {
            id
            order
            target
            title
            url
            label
          }
        }
      }
    }
  }
`;

export const PAGE_QUERY = gql`
  ${PAGE_FRAGMENT}
  query PageQuery($language: LanguageCodeFilterEnum) {
    ...PageFragment
  }
`;

type Props = Omit<React.ComponentProps<typeof PageMeta>, "languages"> &
  Omit<
    React.ComponentProps<LayoutComponent>,
    "children" | "languages" | "menuItems"
  > & {
    children: React.ReactNode;
    layoutComponent?: LayoutComponent;
  };

function Page({
  children,
  layoutComponent: Layout = DefaultLayout,
  navigationVariant,
  ...rest
}: Props) {
  const { locale, defaultLocale } = useRouter();
  const { data } = useQuery(PAGE_QUERY, {
    variables: {
      menuLocation: getMenuLocationFromLanguage(locale ?? defaultLocale),
    },
  });

  const menuItems = data?.pageMenus?.nodes?.[0]?.menuItems?.nodes ?? [];
  const languages = data?.pageLanguages ?? [];

  return (
    <>
      <PageMeta {...rest} languages={languages} />
      <Layout
        menuItems={menuItems}
        languages={languages}
        navigationVariant={navigationVariant}
      >
        {children}
      </Layout>
    </>
  );
}

export default Page;
