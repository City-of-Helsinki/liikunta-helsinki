import { GetStaticPropsContext } from "next";

import { Language, NavigationItem } from "../../types";
import LanguageApi from "../../api/languageApi";
import menuItems from "./tmp/menuItems";

type LayoutData = {
  languages: Language[];
  navigationItems: NavigationItem[];
};

async function getLayoutData(
  context: GetStaticPropsContext
): Promise<LayoutData> {
  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);
  const navigationItems = sortedMenuItems.map(({ order, ...rest }) => rest);

  return {
    languages: await LanguageApi.get(),
    navigationItems,
  };
}

export default getLayoutData;
