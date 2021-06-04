import { Button, IconSearch } from "hds-react";
import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";

import Text from "../../text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import styles from "./searchPageSearchForm.module.scss";
import searchApolloClient from "../../../api/searchApolloClient";
import { getUnifiedSearchLanguage } from "../../../api/utils";

function getURLSearchParamsFromAsPath(asPath: string): URLSearchParams {
  const [, searchParams] = asPath.split("?");

  return new URLSearchParams(searchParams);
}

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
  refetch: (q: string) => void;
};

function SearchPageSearchForm({ refetch }: Props) {
  const router = useRouter();
  const [searchText, setSearchText] = useState<string>(
    getURLSearchParamsFromAsPath(router.asPath).get("q") ?? ""
  );
  const [findSuggestions, { data }] = useLazyQuery(SUGGESTION_QUERY, {
    client: searchApolloClient,
  });
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const doSearch = (q?: string) => {
    router.push({ query: q ? { q } : "" }, undefined, {
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
    refetch(searchText);
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
