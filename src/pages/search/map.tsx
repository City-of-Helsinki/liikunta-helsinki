import { GetStaticPropsContext } from "next";
import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/dist/client/router";

import Page from "../../components/page/Page";
import initializeCmsApollo from "../../client/cmsApolloClient";
import SearchHeader, {
  ShowMode,
} from "../../components/search/searchHeader/SearchHeader";
import SearchPageSearchForm from "../../components/search/searchPageSearchForm/SearchPageSearchForm";
import { Connection, MapItem, SearchResult } from "../../types";
import { getNodes } from "../../client/utils";
import searchApolloClient from "../../client/searchApolloClient";
import getURLSearchParamsFromAsPath from "../../util/getURLSearchParamsFromAsPath";

// Add ID that matches the sports ontology tree branch that has the Culture,
// sports and leisure department (KuVa) as its parent.
// https://www.hel.fi/palvelukarttaws/rest/v4/ontologytree/551
const SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID = 551;

// This query is placeholder for now. When UnifiedSearch supports search by radius or
// something similar make changes to this query.
export const MAP_SEARCH_QUERY = gql`
  query SearchQuery($q: String, $first: Int, $ontologyTreeId: ID!) {
    unifiedSearch(
      q: $q
      index: "location"
      ontology: "Liikunta"
      first: $first
      ontologyTreeId: $ontologyTreeId
    ) {
      count
      edges {
        node {
          venue {
            meta {
              id
            }
            name {
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

function getSearchResultsAsItems(
  searchResultConnection: Connection<SearchResult> | null
): MapItem[] {
  const searchResults = getNodes<SearchResult>(searchResultConnection);
  return searchResults.map((searchResult) => ({
    id: searchResult.venue.name.fi,
    title: searchResult.venue.name.fi,
    href: `/venues/tprek:${searchResult.venue.meta.id}`,
    location: searchResult.venue.location.geoLocation.geometry.coordinates,
  }));
}

export default function MapSearch() {
  const router = useRouter();
  const {
    query: { q: searchText = "*" },
  } = router;

  const { data } = useQuery(MAP_SEARCH_QUERY, {
    client: searchApolloClient,
    ssr: false,
    variables: {
      q: searchText,
      first: 100,
      ontologyTreeId: SPORTS_DEPARTMENT_ONTOLOGY_TREE_ID,
    },
    fetchPolicy: "cache-and-network",
  });

  // https://stackoverflow.com/a/64634759
  const MapView = dynamic(() => import("../../components/mapView/MapView"), {
    ssr: false,
  });

  const searchResultItems: MapItem[] = getSearchResultsAsItems(
    data?.unifiedSearch ?? emptyConnection
  );

  const switchShowMode = () => {
    const searchParams = getURLSearchParamsFromAsPath(router.asPath);
    router.replace({
      pathname: "/search",
      query: searchParams.toString(),
    });
  };

  const count = data?.unifiedSearch?.count;

  return (
    <Page title="Map" description="Map">
      <SearchHeader
        showMode={ShowMode.MAP}
        count={count}
        switchShowMode={switchShowMode}
        searchForm={<SearchPageSearchForm showTitle={false} />}
      />
      <MapView items={searchResultItems} />
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
