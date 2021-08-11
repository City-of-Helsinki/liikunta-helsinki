import React, { useRef } from "react";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Koros } from "hds-react";

import initializeCmsApollo from "../../client/cmsApolloClient";
import getURLSearchParamsFromAsPath from "../../util/getURLSearchParamsFromAsPath";
import searchApolloClient from "../../client/searchApolloClient";
import Page from "../../components/page/Page";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/searchResultCard";
import SearchList from "../../components/list/SearchList";
import styles from "./search.module.scss";
import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import SearchHeader, {
  ShowMode,
} from "../../components/search/searchHeader/SearchHeader";
import { Connection, Item, Keyword, SearchResult } from "../../types";
import { getNodes } from "../../client/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const BLOCK_SIZE = 10;

export const SEARCH_QUERY = gql`
  query SearchQuery($q: String, $first: Int, $cursor: String) {
    unifiedSearch(
      q: $q
      index: "location"
      ontology: "Liikunta"
      first: $first
      after: $cursor
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
            }
            description {
              fi
            }
            location {
              geoLocation {
                geometry {
                  coordinates
                }
              }
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

const emptyConnection = {
  edges: [],
};

const mockKeywords: Keyword[] = [
  { label: "Maauimala", onClick: noop },
  { label: "Uinti", onClick: noop },
  { label: "Ulkoliikuntapaikat", onClick: noop },
];

function getSearchResultsAsItems(
  searchResultConnection: Connection<SearchResult> | null
): Item[] {
  const searchResults = getNodes<SearchResult>(searchResultConnection);
  return searchResults.map((searchResult) => ({
    id: searchResult.venue.name.fi,
    title: searchResult.venue.name.fi,
    infoLines: [],
    href: `/venues/tprek:${searchResult.venue.meta.id}`,
    keywords: mockKeywords,
    image: searchResult.venue.images[0]?.url,
    location: searchResult.venue.location.geoLocation.geometry.coordinates,
  }));
}

export default function Search() {
  const router = useRouter();
  const {
    query: { q: searchText = "*" },
  } = router;

  const { data, loading, fetchMore } = useQuery(SEARCH_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: { q: searchText, first: BLOCK_SIZE, after: "" },
    fetchPolicy: "cache-and-network",
  });

  const searchResultItems: Item[] = getSearchResultsAsItems(
    data?.unifiedSearch ?? emptyConnection
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
          items={searchResultItems.map((item) => (
            <SearchResultCard key={item.id} {...item} />
          ))}
          switchShowMode={switchShowMode}
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
