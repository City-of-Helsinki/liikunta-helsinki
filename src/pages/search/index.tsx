import React, { useRef } from "react";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Koros } from "hds-react";
import dynamic from "next/dynamic";

import Page from "../../components/page/Page";
import searchApolloClient from "../../client/searchApolloClient";
import styles from "./search.module.scss";
import { Connection, Item, Keyword, SearchResult } from "../../types";
import { getNodes } from "../../client/utils";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/searchResultCard";
import SearchList from "../../components/list/SearchList";
import initializeCmsApollo from "../../client/cmsApolloClient";
import SearchHeader from "../../components/search/searchHeader/SearchHeader";
import updateUrlParams from "../../util/updateURLParams";

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
    href: "",
    keywords: mockKeywords,
    location: searchResult.venue.location.geoLocation.geometry.coordinates,
    image:
      "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg",
  }));
}

export default function Search() {
  const router = useRouter();
  const {
    query: { q: searchText, show },
  } = router;

  const { data, loading, refetch, fetchMore } = useQuery(SEARCH_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: { q: searchText ?? "*", first: BLOCK_SIZE, after: "" },
  });

  // https://stackoverflow.com/a/64634759
  const MapView = dynamic(() => import("../../components/mapView/MapView"), {
    ssr: false,
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
        q: searchText ?? "*",
        first: BLOCK_SIZE,
        cursor: cursor,
      },
    }).then(() => {
      moreResultsAnnouncerRef.current &&
        moreResultsAnnouncerRef.current.focus();
    });
  };

  const onRefetch = (q) => {
    refetch({ q: q ?? "*", first: BLOCK_SIZE });
  };

  const switchShowMode = () => {
    const nextMode = showMode === "list" ? "map" : "list";
    const params = updateUrlParams(router.asPath, "show", nextMode);

    router.replace({ pathname: router.pathname, query: params }, undefined, {
      shallow: true,
    });
  };

  const showMode = show === "map" || show === "list" ? show : "list";

  return (
    <Page title="Search" description="Search">
      <SearchHeader
        showMode={showMode}
        count={count}
        refetch={onRefetch}
        switchShowMode={switchShowMode}
      />
      {showMode === "map" && <MapView items={searchResultItems} />}
      {showMode === "list" && (
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
      )}
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
