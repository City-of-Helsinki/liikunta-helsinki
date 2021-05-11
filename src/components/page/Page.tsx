import React from "react";

import DefaultLayout from "../layout/Layout";
import PageMeta, { Props as PageMetaProps } from "../meta/PageMeta";
import { LayoutComponent } from "../layout/types";

type Props = PageMetaProps & {
  children: React.ReactNode;
  layoutComponent?: LayoutComponent;
  layout: Omit<React.ComponentProps<LayoutComponent>, "children">;
};

function Page({
  children,
  layout,
  layoutComponent: Layout = DefaultLayout,
  ...rest
}: Props) {
  return (
    <>
      <PageMeta {...rest} languages={layout.languages} />
      <Layout {...layout}>{children}</Layout>
    </>
  );
}

export default Page;
