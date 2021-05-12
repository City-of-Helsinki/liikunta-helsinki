import { GetStaticPropsContext } from "next";

export type NavigationItem = {
  id: string;
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

type Keyword = {
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
