import { GetStaticPropsContext } from "next";

import { NavigationItem } from "../../types";
import menuItems from "./tmp/menuItems";

type MenuItem = {
  id: string;
  order: number;
  path: string;
  target: string;
  title: string;
  url: string;
};

type LayoutData = {
  languages: Array<{
    id: string;
    name: string;
    slug: string;
    code: string;
    locale: string;
  }>;
  navigationItems: NavigationItem[];
};

async function getLayoutData(
  context: GetStaticPropsContext
): Promise<LayoutData> {
  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);
  const navigationItems = sortedMenuItems.map(({ order, ...rest }) => rest);

  return {
    languages: [],
    navigationItems,
  };
}

export default getLayoutData;
