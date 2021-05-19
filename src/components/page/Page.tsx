import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";

import { getQlLanguage } from "../../api/utils";
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
    pageMenuItems: menuItems(
      where: { location: PRIMARY, language: $language }
    ) {
      nodes {
        id
        order
        target
        title
        url
      }
    }
  }
`;

export const PAGE_QUERY = gql`
  ${PAGE_FRAGMENT}
  query PageQuery($language: LanguageCodeFilterEnum) {
    ...PageFragment
    __typename
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
  ...rest
}: Props) {
  const { locale } = useRouter();
  const { data } = useQuery(PAGE_QUERY, {
    variables: {
      language: getQlLanguage(locale),
    },
  });

  const menuItems = data?.pageMenuItems?.nodes ?? [];
  const languages = data?.pageLanguages ?? [];

  return (
    <>
      <PageMeta {...rest} languages={languages} />
      <Layout menuItems={menuItems} languages={languages}>
        {children}
      </Layout>
    </>
  );
}

export default Page;
