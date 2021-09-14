import { gql, useQuery } from "@apollo/client";

import { LocalizedString } from "../../../types";
import { Locale } from "../../../config";
import { SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID } from "../../../constants";
import searchApolloClient from "../../../domain/unifiedSearch/searchApolloClient";
import useRouter from "../../i18n/router/useRouter";
import getTranslation from "../../../common/utils/getTranslation";

type OntologyTree = {
  id: string;
  level: string;
  name: LocalizedString;
};

const ONTOLOGY_TREE_QUERY = gql`
  query OntologyTreeQuery {
    ontologyTree(rootId: ${SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID}, leavesOnly: true) {
      id
      name {
        fi
        sv
        en
      }
    }
  }
`;

function sortOntologyTreesAlphabetically(
  ontologyTrees: OntologyTree[],
  locale: Locale
) {
  if (!ontologyTrees) {
    return ontologyTrees;
  }

  const sorted = [...ontologyTrees];

  sorted.sort((a, b) => {
    const aValue = getTranslation(a.name, locale);
    const bValue = getTranslation(b.name, locale);

    return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
  });

  return sorted;
}

export default function useOntologyTree() {
  const { locale } = useRouter();
  const { data, ...delegated } = useQuery(ONTOLOGY_TREE_QUERY, {
    client: searchApolloClient,
  });

  return {
    ontologyTree: sortOntologyTreesAlphabetically(data?.ontologyTree, locale),
    ...delegated,
  };
}
