import {
  ApolloClient,
  ApolloQueryResult,
  gql,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from "@apollo/client";
import { GetStaticPropsContext } from "next";

import { Language } from "../types";
import mockMenuItems from "./tmp/menuItems";
import { getQlLanguage } from "./utils";
import { PAGE_FRAGMENT } from "../components/page/Page";

const GLOBAL_QUERY = gql`
  ${PAGE_FRAGMENT}
  query PageQuery($language: LanguageCodeFilterEnum) {
    ...PageFragment
    __typename
  }
`;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async pageQuery<T = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, T> & {
      nextContext: GetStaticPropsContext;
    }
  ): Promise<ApolloQueryResult<T>> {
    const { nextContext, ...apolloOptions } = options;

    const globalQueryOptions = {
      query: GLOBAL_QUERY,
      variables: {
        language: getQlLanguage(
          nextContext.locale ?? nextContext.defaultLocale
        ),
      },
    };

    const { data: globalData } = await super.query(globalQueryOptions);

    this.writeQuery({
      ...globalQueryOptions,
      data: {
        ...globalData,
        // Only use languages that this project supports
        pageLanguages: getSupportedLanguages(
          globalData.pageLanguages,
          nextContext
        ),
        pageMenuItems: {
          ...globalData.pageMenuItems,
          nodes:
            // Use mock data until menu items are defined in the CMS
            globalData.pageMenuItems.nodes.length === 0
              ? mockMenuItems
              : globalData.pageMenuItems.nodes,
        },
      },
    });

    return super.query(apolloOptions);
  }
}

export default LiikuntaApolloClient;
