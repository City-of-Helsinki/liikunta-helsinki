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
import { getMenuLocationFromLanguage } from "./utils";
import { PAGE_FRAGMENT } from "../components/page/Page";

const GLOBAL_QUERY = gql`
  ${PAGE_FRAGMENT}
  query PageQuery($menuLocation: MenuLocationEnum!) {
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

type CustomQueryOptions<TVariables, T> = Omit<
  QueryOptions<TVariables, T>,
  "query"
> & {
  // Allow passing of next context in order to use locale and other data
  nextContext: GetStaticPropsContext;
  // Allow query to be left undefined. In this case only the global query is
  // fired.
  query?: QueryOptions<TVariables, T>["query"];
};

class LiikuntaApolloClient extends ApolloClient<NormalizedCacheObject> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async pageQuery<T = any, TVariables = OperationVariables>(
    options: CustomQueryOptions<TVariables, T>
  ): Promise<ApolloQueryResult<T>> {
    const { nextContext, ...apolloOptions } = options;

    const globalQueryOptions = {
      query: GLOBAL_QUERY,
      variables: {
        menuLocation: getMenuLocationFromLanguage(
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
      },
    });

    const query = apolloOptions.query;

    if (query) {
      return super.query({
        ...apolloOptions,
        query,
      });
    }
  }
}

export default LiikuntaApolloClient;
