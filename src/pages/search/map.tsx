import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { GetStaticPropsContext } from "next";

import initializeCmsApollo from "../../domain/clients/cmsApolloClient";
import { getNodes, getQlLanguage } from "../../common/apollo/utils";
import getURLSearchParamsFromAsPath from "../../common/utils/getURLSearchParamsFromAsPath";
import useUnifiedSearchQuery from "../../domain/unifiedSearch/useUnifiedSearchQuery";
import useRouter from "../../domain/i18n/router/useRouter";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import { getLocaleOrError } from "../../domain/i18n/router/utils";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import Page from "../../common/components/page/Page";
import getPageMetaPropsFromSEO from "../../common/components/page/getPageMetaPropsFromSEO";
import SearchPageSearchForm from "../../domain/search/searchPageSearchForm/SearchPageSearchForm";
import SearchHeader, {
  ShowMode,
} from "../../domain/search/searchHeader/SearchHeader";
import { Connection, MapItem, SearchResult } from "../../types";

// This query is placeholder for now. When UnifiedSearch supports search by radius or
// something similar make changes to this query.
export const MAP_SEARCH_QUERY = gql`
  query MapSearchQuery(
    $q: String
    $first: Int
    $after: String
    $language: UnifiedSearchLanguage!
    $administrativeDivisionIds: [ID!]
    $ontologyTreeIds: [ID!]
    $openAt: String
  ) {
    unifiedSearch(
      q: $q
      index: "location"
      first: $first
      after: $after
      languages: [$language]
      administrativeDivisionIds: $administrativeDivisionIds
      ontologyTreeIds: $ontologyTreeIds
      openAt: $openAt
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
              sv
              en
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

export const MAP_SEARCH_PAGE_QUERY = gql`
  query MapSearchPageQuery($languageCode: LanguageCodeEnum!) {
    page(id: "/map-search", idType: URI) {
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
  const { data } = useUnifiedSearchQuery(MAP_SEARCH_QUERY, {
    first: 10000,
  });
  const mapSearchPageQuery = useQuery(MAP_SEARCH_PAGE_QUERY, {
    variables: {
      languageCode: getQlLanguage(router.locale),
    },
  });

  // https://stackoverflow.com/a/64634759
  const MapView = dynamic(
    () => import("../../common/components/mapView/MapView"),
    {
      ssr: false,
    }
  );

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
    <Page
      {...getPageMetaPropsFromSEO(
        mapSearchPageQuery?.data?.page?.translation?.seo
      )}
      showFooter={false}
    >
      <SearchHeader
        showMode={ShowMode.MAP}
        count={count}
        switchShowMode={switchShowMode}
        searchForm={
          <SearchPageSearchForm showTitle={false} searchRoute="/search/map" />
        }
      />
      <MapView items={searchResultItems} />
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const cmsClient = initializeCmsApollo();

  await cmsClient.pageQuery({
    nextContext: context,
    query: MAP_SEARCH_PAGE_QUERY,
    variables: {
      languageCode: getQlLanguage(context.locale),
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslationsWithCommon(
        getLocaleOrError(context.locale),
        [
          "search_header",
          "search_page_search_form",
          "map_view",
          "multi_select_combobox",
        ]
      )),
    },
    revalidate: 10,
  };
}
