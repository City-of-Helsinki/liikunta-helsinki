import React, { useRef } from "react";
import { GetStaticPropsContext } from "next";
import { gql, useQuery } from "@apollo/client";
import { Koros } from "hds-react";

import {
  Connection,
  Item,
  Keyword,
  LocalizedString,
  SearchResult,
} from "../../types";
import searchApolloClient from "../../client/searchApolloClient";
import { getNodes } from "../../client/utils";
import initializeCmsApollo from "../../client/cmsApolloClient";
import useRouter from "../../domain/i18nRouter/useRouter";
import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import Page from "../../components/page/Page";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/searchResultCard";
import SearchList from "../../components/list/SearchList";
import styles from "./search.module.scss";
import { Locale } from "../../config";

const BLOCK_SIZE = 10;

export const SEARCH_QUERY = gql`
  query SearchQuery(
    $q: String
    $first: Int
    $cursor: String
    $language: UnifiedSearchLanguage!
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $cursor
      languages: [$language]
    ) {
      count
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          venue {
            meta {
              id
            }
            name {
              fi
              sv
              en
            }
            description {
              fi
            }
            images {
              url
            }
          }
        }
      }
    }
  }
`;

const appToUnifiedSearchLanguageMap = {
  fi: "FINNISH",
  sv: "SWEDISH",
  en: "ENGLISH",
};

const emptyConnection = {
  edges: [],
};

const mockKeywords: Keyword[] = [
  { label: "Maauimala", href: "" },
  { label: "Uinti", href: "" },
  { label: "Ulkoliikuntapaikat", href: "" },
];

function getTranslation(translation: LocalizedString, locale: Locale) {
  return translation[locale] ?? translation.fi;
}

function getSearchResultsAsItems(
  searchResultConnection: Connection<SearchResult> | null,
  locale: Locale
): Item[] {
  const searchResults = getNodes<SearchResult>(searchResultConnection);

  return searchResults.map((searchResult) => ({
    id: searchResult.venue.meta.id,
    title: getTranslation(searchResult.venue.name, locale),
    infoLines: [],
    href: {
      pathname: "/venues/[id]",
      query: {
        id: `tprek:${searchResult.venue.meta.id}`,
      },
    },
    keywords: mockKeywords,
    image: searchResult.venue.images[0]?.url,
  }));
}

export default function Search() {
  const {
    query: { q: searchText = "*" },
    ...router
  } = useRouter();
  const locale = router.locale ?? router.defaultLocale;
  const { data, loading, fetchMore } = useQuery(SEARCH_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      q: searchText,
      first: BLOCK_SIZE,
      after: "",
      language: appToUnifiedSearchLanguageMap[locale],
    },
    fetchPolicy: "cache-and-network",
  });

  const searchResultItems: Item[] = getSearchResultsAsItems(
    data?.unifiedSearch ?? emptyConnection,
    locale
  );

  const moreResultsAnnouncerRef = useRef<HTMLLIElement>(null);
  const count = data?.unifiedSearch?.count;
  const pageInfo = data?.unifiedSearch?.pageInfo;
  const cursor = pageInfo?.endCursor;

  const onLoadMore = () => {
    fetchMore({
      variables: {
        q: searchText,
        first: BLOCK_SIZE,
        cursor: cursor,
      },
    }).then(() => {
      moreResultsAnnouncerRef.current &&
        moreResultsAnnouncerRef.current.focus();
    });
  };

  return (
    <Page title="Search" description="Search">
      <SearchPageSearchForm />
      <Koros className={styles.koros} />

      <Section variant="contained">
        <SearchList
          ref={moreResultsAnnouncerRef}
          loading={loading}
          onLoadMore={onLoadMore}
          count={count}
          blockSize={BLOCK_SIZE}
          hasNext={pageInfo?.hasNextPage}
          items={searchResultItems.map((item) => (
            <SearchResultCard key={item.id} {...item} />
          ))}
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
