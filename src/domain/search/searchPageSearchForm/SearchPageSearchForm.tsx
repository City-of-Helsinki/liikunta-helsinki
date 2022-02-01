import React, { useRef, useState } from "react";
import { Button, IconSearch, IconCross } from "hds-react";
import debounce from "lodash/debounce";
import { useTranslation } from "next-i18next";
import { add, startOfToday } from "date-fns";

import AppConfig from "../../../domain/app/AppConfig";
import { getUnifiedSearchLanguage } from "../../../common/apollo/utils";
import getTranslation from "../../../common/utils/getTranslation";
import { formatIntoDateTime } from "../../../common/utils/time/format";
import queryPersister from "../../../common/utils/queryPersister";
import useIntermediaryState from "../../../common/hooks/useIntermediaryState";
import Text from "../../../common/components/text/Text";
import SuggestionInput, {
  Suggestion,
} from "../../../common/components/suggestionInput/SuggestionInput";
import Keyword from "../../../common/components/keyword/Keyword";
import SmallSpinner from "../../../common/components/spinners/SmallSpinner";
import Checkbox from "../../../common/components/checkbox/Checkbox";
import DateTimePicker from "../../../common/components/dateTimePicker/DateTimePicker";
import useOntologyWords from "../../unifiedSearch/useOntologyWords";
import {
  useUnifiedSearchCompletionSuggestionsLazyQuery,
  UnifiedSearchLanguage,
} from "../../unifiedSearch/graphql/__generated__";
// eslint-disable-next-line max-len
import AdministrativeDivisionDropdown from "../../unifiedSearch/administrativeDivisionDropdown/AdministrativeDivisionDropdown";
import useAdministrativeDivisions from "../../unifiedSearch/administrativeDivisionDropdown/useAdministrativeDivisions";
import OntologyTreeDropdown from "../../unifiedSearch/ontologyTreeDropdown/OntologyTreeDropdown";
import useOntologyTree from "../../unifiedSearch/ontologyTreeDropdown/useOntologyTree";
import useUnifiedSearch from "../../unifiedSearch/useUnifiedSearch";
import searchApolloClient from "../../unifiedSearch/searchApolloClient";
import { OrderBy } from "../../unifiedSearch/unifiedSearchConstants";
import { UnifiedSearchParameters } from "../../unifiedSearch/types";
import useRouter from "../../i18n/router/useRouter";
import Link from "../../i18n/router/Link";
import styles from "./searchPageSearchForm.module.scss";

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
  const [findSuggestions, { data }] =
    useUnifiedSearchCompletionSuggestionsLazyQuery({
      client: searchApolloClient,
    });
  const administrativeDivisionsQuery = useAdministrativeDivisions();
  const ontologyTreeQuery = useOntologyTree();
  const ontologyWordsQuery = useOntologyWords({
    ids: filters.ontologyWordIds?.map((wordId) => wordId.toString()),
  });
  const debouncedFindSuggestions = useRef(debounce(findSuggestions, 100));

  const doModifyFilters = (filters: UnifiedSearchParameters) => {
    const filterCount = Object.values(filters).filter((value) => value).length;
    // If user has selected search conditions, order by relevance by default.
    // Otherwise defer by providing undefined which enables default logic.
    const defaultOrderBy = filterCount > 0 ? OrderBy.relevance : undefined;

    modifyFilters({
      ...filters,
      orderBy: filters.orderBy ?? defaultOrderBy,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = e.target.q.value;
    const nextFilters = {
      q,
      administrativeDivisionIds,
      ontologyTreeIds,
    };

    if (AppConfig.isHaukiEnabled) {
      const isOpenNowValue = e.target.isOpenNow.checked;
      // Use undefined when false to hide from UI layer
      const isOpenNow = isOpenNowValue ? isOpenNowValue : undefined;

      nextFilters["isOpenNow"] = isOpenNow;
      nextFilters["openAt"] = openAt;
    }

    doModifyFilters({
      ...nextFilters,
      // Wrap q into array to comply with API
      q: [nextFilters.q],
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
        ) as UnifiedSearchLanguage,
      },
    });
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    doModifyFilters({ q: [suggestion.label] });
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
      return formatIntoDateTime(value);
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
      {showTitle && (
        <Text variant="h2" as="h1">
          {t("title")}
        </Text>
      )}
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
        {AppConfig.isHaukiEnabled && (
          <div className={styles.inputStack}>
            <DateTimePicker
              id="openAt"
              name="openAt"
              label={t("open_at.label")}
              value={openAt}
              onChange={handleOpenAtChange}
              locale={router.locale}
              minDate={startOfToday()}
              maxDate={add(startOfToday(), { days: 6 })}
              minDateErrorMessage={t("open_at.error.min_date")}
              maxDateErrorMessage={t("open_at.error.max_date")}
            />
            <Checkbox
              id="isOpenNow"
              name="isOpenNow"
              label={t("is_open_now.label")}
              checked={isOpenNow}
              onChange={handleIsOpenNowChange}
            />
          </div>
        )}
        {filterList.length > 0 && (
          <div className={styles.searchAsFilters}>
            {filterList.map(({ key, value }) => {
              const queryWithout = {
                ...getQueryWithout(key, value),
                orderBy: filters.orderBy,
                orderDir: filters.orderDir,
              };

              return (
                <Keyword
                  key={`${key}-${value}`}
                  color="black"
                  icon={IconCross}
                  aria-label={`${t(
                    "remove_filter_aria_label"
                  )}: ${getSearchParameterLabel(key, value)}`}
                  keyword={getSearchParameterLabel(key, value)}
                  href={{
                    query: queryWithout,
                  }}
                  onClick={() => {
                    queryPersister.persistQuery(queryWithout);
                  }}
                />
              );
            })}
            <Link href={searchRoute}>
              <a
                className={styles.clearSearchParameters}
                onClick={() => {
                  queryPersister.persistQuery({});
                }}
              >
                {t("clear_filters")}
              </a>
            </Link>
          </div>
        )}
        <Button
          type="submit"
          className={styles.submitButton}
          iconLeft={<IconSearch aria-hidden="true" />}
        >
          {t("do_search")}
        </Button>
      </form>
    </div>
  );
}

export default SearchPageSearchForm;
