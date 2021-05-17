/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from "@apollo/client";
import { GetStaticPropsContext } from "next";

import { Language, MenuItem } from "../types";
import mockMenuItems from "./tmp/menuItems";

function getNavigationItems(menuItemsConnection: { nodes: MenuItem[] }) {
  let menuItems = menuItemsConnection.nodes;

  if (menuItems.length === 0) {
    menuItems = mockMenuItems;
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);
  const navigationItems = sortedMenuItems.map(({ order, ...rest }) => rest);

  return navigationItems;
}

function getSupportedLanguages(
  languages: Language[],
  context: GetStaticPropsContext
) {
  // NextJS uses locales as is in the slug. The headless CMS has a locale and
  // a slug field. The slug field is meant to be used in urls. To be able to do
  // so, we have to provide the slug field value for NextJS when configuring its
  // i18n module. That's why we are trying to find the slug field from NextJS
  // locales.
  const supportedLanguages = languages.filter(({ slug }) =>
    context.locales.includes(slug)
  );

  return supportedLanguages;
}

class LiikuntaApolloClient extends ApolloClient<NormalizedCacheObject> {
  async pageQuery<T = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, T> & {
      nextContext: GetStaticPropsContext;
    }
  ): Promise<ApolloQueryResult<T>> {
    const { nextContext, query, ...apolloOptions } = options;
    const globalData = gql`
      {
        globalLanguages: languages {
          id
          name
          slug
          code
          locale
        }
        globalMenuItems: menuItems {
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

    // @ts-ignore
    query.definitions[0].selectionSet.selections = [
      // @ts-ignore
      ...query.definitions[0].selectionSet.selections,
      // @ts-ignore
      ...globalData.definitions[0].selectionSet.selections,
    ];

    const {
      // @ts-ignore
      data: { globalLanguages, globalMenuItems, ...restOfData },
      ...rest
    } = await super.query({ query, ...apolloOptions });

    return {
      ...rest,
      // @ts-ignore
      data: {
        ...restOfData,
        globalLanguages: getSupportedLanguages(globalLanguages, nextContext),
        globalMenuItems: getNavigationItems(globalMenuItems),
      },
    };
  }
}

export default LiikuntaApolloClient;
