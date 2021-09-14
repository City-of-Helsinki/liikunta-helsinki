import React, { useRef, useState, useEffect } from "react";
import { Button, IconSearch, IconCross } from "hds-react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";

// eslint-disable-next-line max-len
import AdministrativeDivisionDropdown from "../../../widgets/administrativeDivisionDropdown/AdministrativeDivisionDropdown";
import useAdministrativeDivisions from "../../../widgets/administrativeDivisionDropdown/useAdministrativeDivisions";
import OntologyTreeDropdown from "../../../widgets/ontologyTreeDropdown/OntologyTreeDropdown";
import useOntologyTree from "../../../widgets/ontologyTreeDropdown/useOntologyTree";
import useUnifiedSearch from "../../../domain/unifiedSearch/useUnifiedSearch";
import useRouter from "../../../domain/i18n/router/useRouter";
import Link from "../../../domain/i18n/router/Link";
import searchApolloClient from "../../../client/searchApolloClient";
import { getUnifiedSearchLanguage } from "../../../client/utils";
import getTranslation from "../../../util/getTranslation";
import Text from "../../text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../suggestionInput/SuggestionInput";
import Keyword from "../../keyword/Keyword";
import SmallSpinner from "../../spinners/SmallSpinner";
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
  const { filterList, modifyFilters, getFiltersWithout, filters } =
    useUnifiedSearch();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [administrativeDivisionIds, setAdministrativeDivisionIds] = useState<
    string[]
  >(filters.administrativeDivisionIds);
  const [ontologyTreeIds, setOntologyTreeIds] = useState<number[]>(
    filters.ontologyTreeIds
  );
  const [findSuggestions, { data }] = useLazyQuery(SUGGESTION_QUERY, {
    client: searchApolloClient,
  });
  const administrativeDivisionsQuery = useAdministrativeDivisions();
  const ontologyTreeQuery = useOntologyTree();
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  useEffect(() => {
    setAdministrativeDivisionIds(filters.administrativeDivisionIds);
  }, [filters.administrativeDivisionIds]);

  useEffect(() => {
    setOntologyTreeIds(filters.ontologyTreeIds);
  }, [filters.ontologyTreeIds]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = e.target.q.value;

    modifyFilters({
      q: [q],
      administrativeDivisionIds,
      ontologyTreeIds,
    });
    setSearchText("");
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
    modifyFilters({ q: [suggestion.label] });
  };

  const handleAdminDivisionChange = (administrativeDivisionIds: string[]) => {
    setAdministrativeDivisionIds(administrativeDivisionIds);
  };

  const handleOntologyChange = (ontologyIds: string[]) => {
    setOntologyTreeIds(ontologyIds.map((id) => Number(id)));
  };

  const getSearchParameterLabel = (
    key: string,
    value: string | number
  ): string | JSX.Element => {
    if (key === "administrativeDivisionIds") {
      if (administrativeDivisionsQuery.loading) {
        return <SmallSpinner color="white" />;
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

    if (key === "ontologyTreeIds") {
      if (ontologyTreeQuery.loading) {
        return <SmallSpinner color="white" />;
      }

      const ontologyTreeData = ontologyTreeQuery.ontologyTree?.find(
        (tree) => tree.id === value
      );

      if (!ontologyTreeData) {
        return "Could not find ontology tree name";
      }

      return getTranslation(ontologyTreeData.name, router.locale);
    }

    if (typeof value === "string") {
      return value;
    }

    return value.toString();
  };

  const suggestions =
    data?.unifiedSearchCompletionSuggestions?.suggestions ?? [];

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
        <OntologyTreeDropdown
          id="ontologyTreeIds"
          name="ontologyTreeIds"
          label={t("ontology_tree_ids.label")}
          placeholder={t("ontology_tree_ids.placeholder")}
          onChange={handleOntologyChange}
          value={ontologyTreeIds?.map((id) => id.toString())}
        />
        <AdministrativeDivisionDropdown
          id="administrativeDivisionId"
          name="administrativeDivisionId"
          onChange={handleAdminDivisionChange}
          value={administrativeDivisionIds}
        />
        {filterList.length > 0 && (
          <div className={styles.searchAsFilters}>
            {filterList.map(({ key, value }) => (
              <Keyword
                key={`${key}-${value}`}
                color="black"
                icon={IconCross}
                aria-label={`${t(
                  "remove_filter_aria_label"
                )}: ${getSearchParameterLabel(key, value)}`}
                keyword={getSearchParameterLabel(key, value)}
                href={{
                  query: getFiltersWithout(key, value.toString()),
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
