import React, { useRef, useState } from "react";
import { Button, IconSearch } from "hds-react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

import useUnifiedSearchParams from "../../../domain/unifiedSearch/useUnifiedSearchParams";
// eslint-disable-next-line max-len
import AdministrativeDivisionDropdown from "../../../widgets/administrativeDivisionDropdown/AdministrativeDivisionDropdown";
import useRouter from "../../../domain/i18n/router/useRouter";
import useSetUnifiedSearchParams from "../../../domain/unifiedSearch/useSetUnifiedSearchParams";
import { UnifiedSearchParameters } from "../../../domain/unifiedSearch/types";
import searchApolloClient from "../../../client/searchApolloClient";
import Text from "../../text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import { getUnifiedSearchLanguage } from "../../../client/utils";
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

type Props = {
  showTitle?: boolean;
  searchRoute?: "/search" | "/search/map";
};

function SearchPageSearchForm({ showTitle = true, searchRoute }: Props) {
  const { t } = useTranslation("search_page_search_form");
  const unifiedSearchParams = useUnifiedSearchParams();
  const router = useRouter();
  const { setUnifiedSearchParams } = useSetUnifiedSearchParams({ searchRoute });
  const [searchText, setSearchText] = useState<string | undefined>(
    unifiedSearchParams.q
  );
  const [administrativeDivisionId, setAdministrativeDivisionId] = useState<
    string | undefined
  >(unifiedSearchParams.administrativeDivisionId);
  const [findSuggestions, { data }] = useLazyQuery(SUGGESTION_QUERY, {
    client: searchApolloClient,
  });
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const doSearch = (query: UnifiedSearchParameters) => {
    setUnifiedSearchParams(query, "replace");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = e.target.q.value;

    doSearch({ q, administrativeDivisionId });
  };

  const handleSearchTextChange = (value: string) => {
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
    doSearch({ q: suggestion.label });
  };

  const handleAdminDivisionChange = (administrativeDivisionId: string) => {
    setAdministrativeDivisionId(administrativeDivisionId);
  };

  const suggestions =
    data?.unifiedSearchCompletionSuggestions?.suggestions ?? [];

  useEffect(() => {
    setSearchText(unifiedSearchParams.q);
  }, [unifiedSearchParams.q]);

  return (
    <div>
      {showTitle && <Text variant="h1">{t("title")}</Text>}
      <form role="search" className={styles.form} onSubmit={handleSubmit}>
        <SuggestionInput
          name="q"
          id="q"
          label={t("free_text_search.label")}
          placeholder={t("free_text_search.placeholder")}
          value={searchText || ""}
          onChange={handleSearchTextChange}
          onSelectedItemChange={handleSelectSuggestion}
          suggestions={suggestions.map((suggestion) => ({
            id: suggestion.label,
            label: suggestion.label,
          }))}
          toggleButtonAriaLabel={t("free_text_search.toggle_button_aria_label")}
        />
        <AdministrativeDivisionDropdown
          id="administrativeDivisionId"
          name="administrativeDivisionId"
          onChange={handleAdminDivisionChange}
          value={administrativeDivisionId || ""}
        />
        <Button
          type="submit"
          className={styles.submitButton}
          iconLeft={<IconSearch />}
        >
          {t("do_search")}
        </Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
