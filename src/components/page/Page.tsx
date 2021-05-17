import { useQuery, gql } from "@apollo/client";
import React from "react";

import DefaultLayout from "../layout/Layout";
import { LayoutComponent } from "../layout/types";
import PageMeta from "../meta/PageMeta";

export const PAGE_QUERY = gql`
  query PageQuery {
    languages {
      id
      name
      slug
      code
      locale
    }
    menuItems {
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
  const { data } = useQuery(PAGE_QUERY);

  const menuItems = data?.menuItems.nodes ?? [];
  const languages = data?.languages ?? [];

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
