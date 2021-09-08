import React, { useRef, useState } from "react";
import { Button, IconSearch, IconCross, LoadingSpinner } from "hds-react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";

// eslint-disable-next-line max-len
import AdministrativeDivisionDropdown from "../../../widgets/administrativeDivisionDropdown/AdministrativeDivisionDropdown";
import useAdministrativeDivisions from "../../../widgets/administrativeDivisionDropdown/useAdministrativeDivisions";
import useUnifiedSearchParams from "../../../domain/unifiedSearch/useUnifiedSearchParams";
import useRouter from "../../../domain/i18n/router/useRouter";
import Link from "../../../domain/i18n/router/Link";
import useSetUnifiedSearchParams from "../../../domain/unifiedSearch/useSetUnifiedSearchParams";
import { UnifiedSearchParameters } from "../../../domain/unifiedSearch/types";
import searchApolloClient from "../../../client/searchApolloClient";
import { getUnifiedSearchLanguage } from "../../../client/utils";
import getTranslation from "../../../util/getTranslation";
import Text from "../../text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import Keyword from "../../keyword/Keyword";
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

function SearchPageSearchForm({
  showTitle = true,
  searchRoute = "/search",
}: Props) {
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
  const administrativeDivisionsQuery = useAdministrativeDivisions();
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const doSearch = (query: UnifiedSearchParameters) => {
    setUnifiedSearchParams(query, "replace");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = e.target.q.value;

    doSearch({
      q,
      ...(administrativeDivisionId && {
        administrativeDivisionId,
      }),
    });
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

  const getQueryParametersWithout = (parameterName: string) => {
    const nextParameters = Object.entries(unifiedSearchParams).reduce(
      (acc, [key, value]) => {
        if (key === parameterName) {
          return acc;
        }

        return {
          ...acc,
          [key]: value,
        };
      },
      {}
    );

    return new URLSearchParams(nextParameters).toString();
  };

  const getSearchParameterLabel = (
    key: string,
    value: string | number
  ): string | JSX.Element => {
    if (key === "administrativeDivisionId") {
      if (administrativeDivisionsQuery.loading) {
        return <LoadingSpinner />;
      }

      const divisionData =
        administrativeDivisionsQuery.data?.administrativeDivisions?.find(
          (division) => division.id === value
        );

      if (!divisionData) {
        return "Could not find division name";
      }

      return getTranslation(divisionData.name, router.locale);
    }

    if (typeof value === "string") {
      return value;
    }

    return value.toString();
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
        {Object.entries(unifiedSearchParams).length > 0 && (
          <div className={styles.searchAsFilters}>
            {Object.entries(unifiedSearchParams).map(([key, value]) => (
              <Keyword
                key={key}
                color="black"
                icon={IconCross}
                aria-label={`${t(
                  "remove_filter_aria_label"
                )}: ${getSearchParameterLabel(key, value)}`}
                keyword={getSearchParameterLabel(key, value)}
                href={{
                  search: getQueryParametersWithout(key),
                }}
              />
            ))}
            <Link href={searchRoute}>
              <a className={styles.clearSearchParameters}>
                {t("clear_filters")}
              </a>
            </Link>
          </div>
        )}
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
