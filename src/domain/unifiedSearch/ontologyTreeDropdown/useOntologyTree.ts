import { Locale } from "../../../config";
import { SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID } from "../../../constants";
import searchApolloClient from "../../../domain/unifiedSearch/searchApolloClient";
import useRouter from "../../i18n/router/useRouter";
import getTranslation from "../../../common/utils/getTranslation";
import {
  useOntologyTreeQuery,
  OntologyTreeQuery,
} from "../graphql/__generated__";

function sortOntologyTreesAlphabetically(
  ontologyTrees: OntologyTreeQuery["ontologyTree"],
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
  const { data, ...delegated } = useOntologyTreeQuery({
    client: searchApolloClient,
    variables: {
      rootId: SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID.toString(),
    },
  });

  return {
    ontologyTree: sortOntologyTreesAlphabetically(data?.ontologyTree, locale),
    ...delegated,
  };
}
