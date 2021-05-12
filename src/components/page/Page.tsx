import React from "react";

import DefaultLayout from "../layout/Layout";
import { LayoutComponent } from "../layout/types";
import PageMeta from "../meta/PageMeta";

type Props = React.ComponentProps<typeof PageMeta> &
  Omit<React.ComponentProps<LayoutComponent>, "children"> & {
    children: React.ReactNode;
    layoutComponent?: LayoutComponent;
  };

function Page({
  children,
  layoutComponent: Layout = DefaultLayout,
  menuItems,
  languages,
  ...rest
}: Props) {
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
