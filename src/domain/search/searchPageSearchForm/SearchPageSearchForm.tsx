import React, { useRef, useState } from "react";
import { Button, IconSearch, IconCross } from "hds-react";
import { gql, useLazyQuery } from "@apollo/client";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";

// eslint-disable-next-line max-len
import AdministrativeDivisionDropdown from "../../unifiedSearch/administrativeDivisionDropdown/AdministrativeDivisionDropdown";
import useAdministrativeDivisions from "../../unifiedSearch/administrativeDivisionDropdown/useAdministrativeDivisions";
import OntologyTreeDropdown from "../../unifiedSearch/ontologyTreeDropdown/OntologyTreeDropdown";
import useOntologyTree from "../../unifiedSearch/ontologyTreeDropdown/useOntologyTree";
import useUnifiedSearch from "../../unifiedSearch/useUnifiedSearch";
import useRouter from "../../i18n/router/useRouter";
import Link from "../../i18n/router/Link";
import searchApolloClient from "../../../domain/unifiedSearch/searchApolloClient";
import { getUnifiedSearchLanguage } from "../../../common/apollo/utils";
import getTranslation from "../../../common/utils/getTranslation";
import formatDateTimeIntoLocaleString from "../../../common/utils/formatDateTimeIntoLocaleString";
import useIntermediaryState from "../../../common/hooks/useIntermediaryState";
import Text from "../../../common/components/text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../../common/components/suggestionInput/SuggestionInput";
import Keyword from "../../../common/components/keyword/Keyword";
import SmallSpinner from "../../../common/components/spinners/SmallSpinner";
import Checkbox from "../../../common/components/checkbox/Checkbox";
import DateTimePicker from "../../../common/components/dateTimePicker/DateTimePicker";
import styles from "./searchPageSearchForm.module.scss";
import useOntologyWords from "../../unifiedSearch/useOntologyWords";

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
  const { filterList, modifyFilters, getQueryWithout, filters } =
    useUnifiedSearch();
  const router = useRouter();
  const [searchText, setSearchText] = useState<string | null>(null);
  const [administrativeDivisionIds, setAdministrativeDivisionIds] =
    useIntermediaryState<string[]>(filters.administrativeDivisionIds);
  const [ontologyTreeIds, setOntologyTreeIds] = useIntermediaryState<number[]>(
    filters.ontologyTreeIds
  );
  const [isOpenNow, setIsOpenNow] = useIntermediaryState<boolean>(
    filters.isOpenNow ?? false
  );
  const [openAt, setOpenAt] = useIntermediaryState<Date | null>(filters.openAt);
  const [findSuggestions, { data }] = useLazyQuery(SUGGESTION_QUERY, {
    client: searchApolloClient,
  });
  const administrativeDivisionsQuery = useAdministrativeDivisions();
  const ontologyTreeQuery = useOntologyTree();
  const ontologyWordsQuery = useOntologyWords({ ids: filters.ontologyWordIds });
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = e.target.q.value;
    const isOpenNowValue = e.target.isOpenNow.checked;
    // Use undefined when false to hide from UI layer
    const isOpenNow = isOpenNowValue ? isOpenNowValue : undefined;

    modifyFilters({
      q: [q],
      administrativeDivisionIds,
      ontologyTreeIds,
      isOpenNow,
      openAt,
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

  const handleIsOpenNowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOpenAt(null);
    setIsOpenNow(e.target.checked);
  };

  const handleOpenAtChange = (date: Date) => {
    setIsOpenNow(false);
    setOpenAt(date);
  };

  const getSearchParameterLabel = (
    key: string,
    value: string | number | boolean | Date
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

    if (key === "ontologyWordIds") {
      if (ontologyWordsQuery.loading) {
        return <SmallSpinner color="white" />;
      }

      const ontologyWordData = ontologyWordsQuery.ontologyWords?.find(
        (ontology) => ontology.id === value
      );

      if (!ontologyWordData) {
        return "Could not find ontology";
      }

      return getTranslation(ontologyWordData.label, router.locale);
    }

    if (key === "isOpenNow") {
      return t("is_open_now.label");
    }

    if (value instanceof Date) {
      return formatDateTimeIntoLocaleString(value, router.locale);
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
          id="administrativeDivisionIds"
          name="administrativeDivisionIds"
          label={t("administrative_division_dropdown.label")}
          placeholder={t("administrative_division_dropdown.placeholder")}
          onChange={handleAdminDivisionChange}
          value={administrativeDivisionIds}
        />
        <div className={styles.inputStack}>
          <DateTimePicker
            id="openAt"
            name="openAt"
            label={t("open_at.label")}
            value={openAt}
            onChange={handleOpenAtChange}
            locale={router.locale}
          />
          <Checkbox
            id="isOpenNow"
            name="isOpenNow"
            label={t("is_open_now.label")}
            checked={isOpenNow}
            onChange={handleIsOpenNowChange}
          />
        </div>
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
                  query: getQueryWithout(key, value),
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
