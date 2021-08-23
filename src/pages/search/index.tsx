import React, { useRef } from "react";
import { GetStaticPropsContext } from "next";
import { gql } from "@apollo/client";
import { Koros, IconLocation } from "hds-react";

import { SearchResult } from "../../types";
import getURLSearchParamsFromAsPath from "../../util/getURLSearchParamsFromAsPath";
import useSearch from "../../hooks/useSearch";
import capitalize from "../../util/capitalize";
import getTranslation from "../../util/getTranslation";
import { getNodes } from "../../client/utils";
import initializeCmsApollo from "../../client/cmsApolloClient";
import useRouter from "../../domain/i18nRouter/useRouter";
import useSearchQuery from "../../domain/unifiedSearch/useSearchQuery";
import unifiedSearchVenueFragment from "../../domain/unifiedSearch/unifiedSearchResultVenueFragment";
import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import Page from "../../components/page/Page";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/SearchResultCard";
import SearchList from "../../components/list/SearchList";
import InfoBlock from "../../components/infoBlock/InfoBlock";
import SearchHeader, {
  ShowMode,
} from "../../components/search/searchHeader/SearchHeader";
import styles from "./search.module.scss";

const BLOCK_SIZE = 10;

export const SEARCH_QUERY = gql`
  query SearchQuery(
    $q: String
    $first: Int
    $after: String
    $language: UnifiedSearchLanguage!
    $ontologyTreeId: ID!
    $administrativeDivisionId: ID
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $after
      languages: [$language]
      ontologyTreeId: $ontologyTreeId
      administrativeDivisionId: $administrativeDivisionId
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

const emptyConnection = {
  edges: [],
};

export default function Search() {
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, loading, fetchMore } = useSearchQuery(SEARCH_QUERY, {
    first: BLOCK_SIZE,
    after: "",
  });
  const { getSearchRoute } = useSearch();

  const searchResults = getNodes<SearchResult>(
    data?.unifiedSearch ?? emptyConnection
  );

  const moreResultsAnnouncerRef = useRef<HTMLLIElement>(null);
  const count = data?.unifiedSearch?.count;
  const pageInfo = data?.unifiedSearch?.pageInfo;
  const afterCursor = pageInfo?.endCursor;

  const onLoadMore = () => {
    fetchMore({
      first: BLOCK_SIZE,
      after: afterCursor,
    }).then(() => {
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

  return (
    <Page title="Search" description="Search">
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
          loading={loading}
          onLoadMore={onLoadMore}
          count={count}
          blockSize={BLOCK_SIZE}
          hasNext={pageInfo?.hasNextPage}
          switchShowMode={switchShowMode}
          items={searchResults.map((searchResult) => {
            const item = {
              id: searchResult.venue.meta.id,
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
                  href: getSearchRoute({
                    ontology: label.toLowerCase(),
                  }),
                };
              }),
              image: searchResult.venue.images[0]?.url,
            };

            return (
              <SearchResultCard
                key={item.id}
                item={item}
                infoBlocks={[
                  <InfoBlock
                    key="location"
                    target="card"
                    icon={<IconLocation />}
                    name={getTranslation(
                      searchResult.venue.location.address.streetAddress,
                      locale
                    )}
                    contents={[
                      <InfoBlock.Link
                        key="map-link"
                        href={`/map?venue=${item.id}`}
                        label="Näytä kartalla"
                      />,
                    ]}
                  />,
                ]}
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
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
    },
    revalidate: 10,
  };
}
