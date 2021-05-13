import { GetStaticPropsContext } from "next";

export type NavigationItem = {
  id: string;
  path: string;
  target: string;
  title: string;
  url: string;
};

export type MenuItem = {
  id: string;
  order: number;
  path: string;
  target: string;
  title: string;
  url: string;
};

export type InferDataGetterResult<T> = T extends (
  context: GetStaticPropsContext
) => PromiseLike<infer U>
  ? U
  : T;

export type Language = {
  id: string;
  name: string;
  slug: string;
  code: string;
  locale: string;
};

export type Keyword = {
  label: string;
  isHighlighted?: boolean;
  onClick: () => void;
};

export type Item = {
  id: string;
  title: string;
  pre: string;
  infoLines: string[];
  keywords: Keyword[];
  href: string;
  image: string;
};

export type LandingPage = {
  title: string;
  desktopImage: {
    uri: string;
  };
  link: string;
};
