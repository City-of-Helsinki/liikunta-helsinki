import { Button, IconSearch } from "hds-react";
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";

import searchApolloClient from "../../../client/searchApolloClient";
import { getUnifiedSearchLanguage } from "../../../client/utils";
import queryPersister from "../../../util/queryPersister";
import getURLSearchParamsFromAsPath from "../../../util/getURLSearchParamsFromAsPath";
import Text from "../../text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import styles from "./searchPageSearchForm.module.scss";

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

function SearchPageSearchForm() {
  const router = useRouter();
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
    router.push({ pathname: router.pathname, query: nextQuery }, undefined, {
      shallow: true,
    });
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
    <div className={styles.searchArea}>
      <Text variant="h1">Mitä etsit?</Text>
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
