import React, { useRef } from "react";
import { GetStaticPropsContext } from "next";
import { gql, useQuery } from "@apollo/client";
import { Koros, IconLocation, IconClock } from "hds-react";
import { useTranslation } from "next-i18next";
import { parse, isWithinInterval } from "date-fns";
import { useEffect } from "react";

import { SearchResult, Time } from "../../types";
import getURLSearchParamsFromAsPath from "../../util/getURLSearchParamsFromAsPath";
import capitalize from "../../util/capitalize";
import getTranslation from "../../util/getTranslation";
import { getNodes, getQlLanguage } from "../../client/utils";
import initializeCmsApollo from "../../client/cmsApolloClient";
import useUnifiedSearch from "../../domain/unifiedSearch/useUnifiedSearch";
import useUnifiedSearchQuery from "../../domain/unifiedSearch/useUnifiedSearchQuery";
import unifiedSearchVenueFragment from "../../domain/unifiedSearch/unifiedSearchResultVenueFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import { logger } from "../../domain/logger";
import SearchPageSearchForm from "../../widgets/searchPageSearchForm/SearchPageSearchForm";
import Page from "../../components/page/Page";
import getPageMetaPropsFromSEO from "../../components/page/getPageMetaPropsFromSEO";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/SearchResultCard";
import SearchList from "../../components/list/SearchList";
import InfoBlock from "../../components/infoBlock/InfoBlock";
import SearchHeader, {
  ShowMode,
} from "../../components/search/searchHeader/SearchHeader";
import styles from "./search.module.scss";
import { humanizeOpeningHour } from "../../util/time/humanizeOpeningHoursForWeek";

const BLOCK_SIZE = 10;

export const SEARCH_QUERY = gql`
  query SearchQuery(
    $q: String
    $first: Int
    $after: String
    $language: UnifiedSearchLanguage!
    $ontologyTreeId: ID!
    $administrativeDivisionIds: [ID!]
    $ontologyTreeIds: [ID!]
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $after
      languages: [$language]
      ontologyTreeId: $ontologyTreeId
      administrativeDivisionIds: $administrativeDivisionIds
      ontologyTreeIds: $ontologyTreeIds
    ) {
      count
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          venue {
            ...unifiedSearchVenueFragment
          }
        }
      }
    }
  }

  ${unifiedSearchVenueFragment}
`;

export const SEARCH_PAGE_QUERY = gql`
  query SearchPageQuery($languageCode: LanguageCodeEnum!) {
    page(id: "/search", idType: URI) {
      translation(language: $languageCode) {
        seo {
          ...seoFragment
        }
      }
    }
  }

  ${seoFragment}
`;

const emptyConnection = {
  edges: [],
};

function getIsOpenNow(times: Time[]): boolean {
  const now = new Date();
  let isOpenNow = false;

  times.forEach((time) => {
    // If this time means that the place is closed, we can't use it to determine
    // whether it is open.
    if (time.resourceState === "closed") {
      return;
    }

    // If the time targets the full day and is not closed, it should mean that
    // it's open in some capacity. Check TimeResourceState to know more about
    // the variants.
    if (time.fullDay) {
      isOpenNow = true;
      return;
    }

    const startTime = time.startTime;
    const endTime = time.endTime;

    // If either startTime or endTime is missing, we can't build an interval and
    // can't check whether the this time means that the place is open.
    if (!startTime || !endTime) {
      return;
    }

    const start = parse(startTime, "HH:mm:ss", new Date());
    const end = parse(endTime, "HH:mm:ss", new Date());

    try {
      if (isWithinInterval(now, { start, end })) {
        isOpenNow = true;
      }
    } catch (e) {
      logger.error(e);
    }
  });

  return isOpenNow;
}

export default function Search() {
  const { t } = useTranslation("search_page");
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const scrollTo = router.query?.scrollTo;
  const { filters, setFilters } = useUnifiedSearch();
  const { data, loading, fetchMore } = useUnifiedSearchQuery(SEARCH_QUERY);
  const searchPageQueryResult = useQuery(SEARCH_PAGE_QUERY, {
    variables: {
      languageCode: getQlLanguage(router.locale),
    },
  });
  const moreResultsAnnouncerRef = useRef<HTMLLIElement>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const searchResults = getNodes<SearchResult>(
    data?.unifiedSearch ?? emptyConnection
  );

  const count = data?.unifiedSearch?.count;
  const pageInfo = data?.unifiedSearch?.pageInfo;
  const afterCursor = pageInfo?.endCursor;

  const onLoadMore = () => {
    const pagination = {
      first: BLOCK_SIZE,
      after: afterCursor,
    };
    setFilters({
      ...filters,
      ...pagination,
    });

    fetchMore(pagination).then(() => {
      moreResultsAnnouncerRef.current &&
        moreResultsAnnouncerRef.current.focus();
    });
  };

  const switchShowMode = () => {
    const params = getURLSearchParamsFromAsPath(router.asPath);

    router.replace(
      { pathname: "/search/map", query: params.toString() },
      undefined,
      {
        shallow: true,
      }
    );
  };

  useEffect(() => {
    const listElement = listRef.current;

    if (scrollTo) {
      const listItemElement = listElement?.querySelector(
        decodeURIComponent(scrollTo.toString())
      );

      if (listItemElement) {
        listItemElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    }
  }, [scrollTo]);

  return (
    <Page
      {...getPageMetaPropsFromSEO(
        searchPageQueryResult?.data?.page?.translation?.seo
      )}
    >
      <SearchHeader
        showMode={ShowMode.LIST}
        count={count}
        switchShowMode={switchShowMode}
        searchForm={<SearchPageSearchForm />}
      />
      <Section variant="contained">
        <Koros className={styles.koros} />
        <SearchList
          ref={moreResultsAnnouncerRef}
          listRef={listRef}
          loading={loading}
          onLoadMore={onLoadMore}
          count={count}
          blockSize={BLOCK_SIZE}
          hasNext={pageInfo?.hasNextPage}
          switchShowMode={switchShowMode}
          items={searchResults.map((searchResult) => {
            const item = {
              id: `tprek_${searchResult.venue.meta.id}`,
              title: getTranslation(searchResult.venue.name, locale),
              infoLines: [],
              href: {
                pathname: "/venues/[id]",
                query: {
                  id: `tprek:${searchResult.venue.meta.id}`,
                },
              },
              keywords: searchResult.venue.ontologyWords.map((word) => {
                const label = getTranslation(word.label, locale);
                return {
                  label: capitalize(label),
                  href: {
                    query: {
                      ontology: label.toLowerCase(),
                    },
                  },
                };
              }),
              image: searchResult.venue.images[0]?.url,
            };
            const streetAddress =
              searchResult.venue.location.address.streetAddress;
            const openingHourTimesToday =
              searchResult.venue?.openingHours?.today ?? [];
            const isOpenNow = getIsOpenNow(openingHourTimesToday);
            const humanizedOpeningHoursForToday = humanizeOpeningHour(
              {
                date: new Date().toJSON(),
                times: openingHourTimesToday,
              },
              locale,
              "short"
            );
            const infoBlocks = [
              <InfoBlock
                key="location"
                target="card"
                icon={<IconLocation />}
                name={
                  streetAddress
                    ? getTranslation(
                        searchResult.venue.location.address.streetAddress,
                        locale
                      )
                    : null
                }
                contents={[
                  <InfoBlock.Link
                    key="map-link"
                    href={`/map?venue=${item.id}`}
                    label={t("show_results_on_map")}
                  />,
                ]}
              />,
              humanizedOpeningHoursForToday ? (
                <InfoBlock
                  key="openingHours"
                  target="card"
                  icon={<IconClock />}
                  name={
                    isOpenNow
                      ? t("block.opening_hours.open_now_label")
                      : t("block.opening_hours.label")
                  }
                  contents={[humanizedOpeningHoursForToday]}
                />
              ) : null,
            ].filter((item) => item);

            return (
              <SearchResultCard
                key={item.id}
                item={item}
                ctaLabel={t("read_more")}
                infoBlocks={infoBlocks}
              />
            );
          })}
        />
      </Section>
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const cmsClient = initializeCmsApollo();

  // We still need to initialize the application with data from the CMS. The
  // data includes things like menus and languages. If we don't initialize, this
  // data will be missing when the application is accessed through the search
  // view.
  await cmsClient.pageQuery({
    nextContext: context,
    query: SEARCH_PAGE_QUERY,
    variables: {
      languageCode: getQlLanguage(context.locale),
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslationsWithCommon(context.locale, [
        "search_page",
        "search_header",
        "search_page_search_form",
        "search_list",
        "multi_select_combobox",
      ])),
    },
    revalidate: 10,
  };
}
