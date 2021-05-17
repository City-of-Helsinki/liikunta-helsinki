import {
  ApolloClient,
  ApolloQueryResult,
  DocumentNode,
  gql,
  NormalizedCacheObject,
  OperationVariables,
  QueryOptions,
} from "@apollo/client";
import { OperationDefinitionNode, SelectionNode } from "graphql";
import { GetStaticPropsContext } from "next";

import { Language, MenuItem } from "../types";
import mockMenuItems from "./tmp/menuItems";

type GlobalData = {
  globalLanguages: Language[];
  globalMenuItems: { nodes: MenuItem[] };
};

function getSelectionSet(documentNode: DocumentNode): SelectionNode[] {
  return documentNode.definitions.find(
    (node): node is OperationDefinitionNode =>
      node.kind === "OperationDefinition"
  )?.selectionSet?.selections as SelectionNode[];
}

const GLOBAL_QUERY = gql`
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

function getNavigationItems(menuItemsConnection: { nodes: MenuItem[] }) {
  let menuItems = menuItemsConnection.nodes;

  if (menuItems.length === 0) {
    menuItems = mockMenuItems;
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  return {
    __typename: "MenuItems",
    nodes: sortedMenuItems,
  };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async pageQuery<T = any, TVariables = OperationVariables>(
    options: QueryOptions<TVariables, T> & {
      nextContext: GetStaticPropsContext;
    }
  ): Promise<ApolloQueryResult<T>> {
    const { nextContext, query, ...apolloOptions } = options;
    const globalDataInjectedFields = getSelectionSet(GLOBAL_QUERY);

    getSelectionSet(query).push(...globalDataInjectedFields);

    const { data, ...rest } = await super.query<T & GlobalData>({
      query,
      ...apolloOptions,
    });

    this.writeQuery({
      query,
      variables: apolloOptions.variables,
      data: {
        ...data,
        globalLanguages: getSupportedLanguages(
          data.globalLanguages,
          nextContext
        ),
        globalMenuItems: getNavigationItems(data.globalMenuItems),
      },
    });

    return { data: this.readQuery({ query, ...apolloOptions }), ...rest };
  }
}

export default LiikuntaApolloClient;
