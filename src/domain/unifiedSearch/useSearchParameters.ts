import useRouter from "../i18n/router/useRouter";

// Add ID that matches the sports ontology tree branch that has the Culture,
// sports and leisure department (KuVa) as its parent.
// https://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/551
const SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID = 551;

const FIXED_FILTERS = {
  ontologyTreeId: SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID,
};

function stringifyQueryValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join(",") : value;
}

export default function useSearchParameters() {
  const {
    query: { q, administrativeDivisionId },
  } = useRouter();

  return {
    q: stringifyQueryValue(q),
    administrativeDivisionId: stringifyQueryValue(administrativeDivisionId),
    ...FIXED_FILTERS,
  };
}
