import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import React from "react";
import { LoadingSpinner, Koros } from "hds-react";

import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import Page from "../../components/page/Page";
import searchApolloClient from "../../api/searchApolloClient";
import styles from "./search.module.scss";
import { Connection, Item, Keyword, SearchResult } from "../../types";
import { getNodes } from "../../api/utils";
import List from "../../components/list/List";
import Text from "../../components/text/Text";
import Section from "../../components/section/Section";
import SearchResultCard from "../../components/card/searchResultCard";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export const SEARCH_QUERY = gql`
  query SearchQuery($q: String) {
    unifiedSearch(q: $q, index: "location", ontology: "Liikunta") {
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
  const {
    query: { q: searchText },
  } = useRouter();

  const { data, loading } = useQuery(SEARCH_QUERY, {
    client: searchApolloClient,
    variables: { q: searchText ?? "*" },
  });

  const searchResultItems: Item[] = getSearchResultsAsItems(
    data?.unifiedSearch ?? emptyConnection
  );

  return (
    <Page title="Search" description="Search">
      <SearchPageSearchForm />
      <Koros className={styles.koros} />
      {loading ? (
        <LoadingSpinner className={styles.spinner} />
      ) : (
        <Section variant="contained">
          <Text variant="h2" className={styles.resultCount} role="status">
            {searchResultItems.length} hakutulosta
          </Text>
          <List
            variant="searchResult"
            items={searchResultItems.map((item) => (
              <SearchResultCard key={item.id} {...item} />
            ))}
          />
        </Section>
      )}
    </Page>
  );
}

export function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {},
  };
}
