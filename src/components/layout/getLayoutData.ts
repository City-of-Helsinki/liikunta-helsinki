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
  const allLanguages = await LanguageApi.get();
  // NextJS uses locales as is in the slug. The headless CMS has a locale and
  // a slug field. The slug field is meant to be used in urls. To be able to do
  // so, we have to provide the slug field value for NextJS when configuring its
  // i18n module. That's why we are trying to find the slug field from NextJS
  // locales.
  const supportedLanguages = allLanguages.filter(({ slug }) =>
    context.locales.includes(slug)
  );

  return {
    languages: supportedLanguages,
    navigationItems,
  };
}

export default getLayoutData;
