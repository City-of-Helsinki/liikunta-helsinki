import React, { useRef, useState } from "react";
import { Button, IconSearch } from "hds-react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";

import getURLSearchParamsFromAsPath from "../../../util/getURLSearchParamsFromAsPath";
import useRouter from "../../../domain/i18nRouter/useRouter";
import queryPersister from "../../../util/queryPersister";
import Text from "../../text/Text";
import useSearch from "../../../hooks/useSearch";
import styles from "./searchPageSearchForm.module.scss";
import searchApolloClient from "../../../client/searchApolloClient";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import { getUnifiedSearchLanguage } from "../../../client/utils";

const SUGGESTION_QUERY = gql`
  query SuggestionQuery($prefix: String, $language: UnifiedSearchLanguage!) {
    unifiedSearchCompletionSuggestions(
      prefix: $prefix
      index: "location"
      languages: [$language]
    ) {
      suggestions {
        label
      }
    }
  }
`;

type Props = {
  showTitle?: boolean;
};

function SearchPageSearchForm({ showTitle = true }: Props) {
  const router = useRouter();
  const { search } = useSearch();
  const [searchText, setSearchText] = useState<string>(
    getURLSearchParamsFromAsPath(router.asPath).get("q") ?? ""
  );
  const [findSuggestions, { data }] = useLazyQuery(SUGGESTION_QUERY, {
    client: searchApolloClient,
  });
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const doSearch = (q?: string) => {
    const nextQuery = q ? { q } : null;

    queryPersister.persistQuery(nextQuery);
    search(nextQuery, "replace");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSearch(e.target.q.value);
  };

  const handleChange = (value: string) => {
    setSearchText(value);
    debouncedFindSuggestions.current({
      variables: {
        prefix: value,
        language: getUnifiedSearchLanguage(
          router.locale || router.defaultLocale
        ),
      },
    });
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    doSearch(suggestion.label);
  };

  const suggestions =
    data?.unifiedSearchCompletionSuggestions?.suggestions ?? [];

  return (
    <div>
      {showTitle && <Text variant="h1">Mitä etsit?</Text>}
      <form role="search" className={styles.form} onSubmit={handleSubmit}>
        <SuggestionInput
          name="q"
          id="q"
          label="Haku"
          placeholder="Kirjoita hakusana, esim. uimahalli tai jooga"
          value={searchText}
          onChange={handleChange}
          onSelectedItemChange={handleSelectSuggestion}
          suggestions={suggestions.map((suggestion) => ({
            id: suggestion.label,
            label: suggestion.label,
          }))}
        />
        <Button type="submit" iconLeft={<IconSearch />}>
          Hae
        </Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
