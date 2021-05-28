import React, { useRef, useState } from "react";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { Koros } from "hds-react";

import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import Page from "../../components/page/Page";
import searchApolloClient from "../../api/searchApolloClient";
import styles from "./search.module.scss";
import { Connection, Item, Keyword, SearchResult } from "../../types";
import { getNodes } from "../../api/utils";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/searchResultCard";
import SearchList from "../../components/list/SearchList";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const BLOCK_SIZE = 10;

export const SEARCH_QUERY = gql`
  query SearchQuery($q: String, $first: Int) {
    unifiedSearch(
      q: $q
      index: "location"
      ontology: "Liikunta"
      first: $first
    ) {
      count
      pageInfo {
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
    image:
      "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg",
  }));
}

export default function Search() {
  const [blockCount, setBlockCount] = useState(1);
  const {
    query: { q: searchText },
  } = useRouter();

  const { data, loading, refetch, fetchMore } = useQuery(SEARCH_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: { q: searchText ?? "*", first: BLOCK_SIZE },
  });

  const searchResultItems: Item[] = getSearchResultsAsItems(
    data?.unifiedSearch ?? emptyConnection
  );

  const moreResultsAnnouncerRef = useRef<HTMLLIElement>(null);

  const onLoadMore = () => {
    const newBlockCount = blockCount + 1;
    fetchMore({
      variables: {
        q: searchText ?? "*",
        first: newBlockCount * BLOCK_SIZE,
      },
    }).then(() => {
      setBlockCount(newBlockCount);
      moreResultsAnnouncerRef.current &&
        moreResultsAnnouncerRef.current.focus();
    });
  };

  const onRefetch = (q) => {
    refetch({ q, first: 10 }).then(() => {
      setBlockCount(1);
    });
  };

  const count = data?.unifiedSearch?.count;
  const pageInfo = data?.unifiedSearch?.pageInfo;

  return (
    <Page title="Search" description="Search">
      <SearchPageSearchForm refetch={onRefetch} />
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

export function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {},
  };
}
