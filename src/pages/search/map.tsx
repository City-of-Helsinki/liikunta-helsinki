import dynamic from "next/dynamic";
import { gql, useQuery } from "@apollo/client";
import { GetStaticPropsContext } from "next";

import initializeCmsApollo from "../../client/cmsApolloClient";
import { getNodes, getQlLanguage } from "../../client/utils";
import getURLSearchParamsFromAsPath from "../../util/getURLSearchParamsFromAsPath";
import useUnifiedSearchQuery from "../../domain/unifiedSearch/useUnifiedSearchQuery";
import unifiedSearchVenueFragment from "../../domain/unifiedSearch/unifiedSearchResultVenueFragment";
import useRouter from "../../domain/i18n/router/useRouter";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import Page from "../../components/page/Page";
import getPageMetaPropsFromSEO from "../../components/page/getPageMetaPropsFromSEO";
import SearchPageSearchForm from "../../widgets/searchPageSearchForm/SearchPageSearchForm";
import SearchHeader, {
  ShowMode,
} from "../../components/search/searchHeader/SearchHeader";
import { Connection, MapItem, SearchResult } from "../../types";

// This query is placeholder for now. When UnifiedSearch supports search by radius or
// something similar make changes to this query.
export const MAP_SEARCH_QUERY = gql`
  query MapSearchQuery(
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
    first: 100,
  });
  const mapSearchPageQuery = useQuery(MAP_SEARCH_PAGE_QUERY, {
    variables: {
      languageCode: getQlLanguage(router.locale),
    },
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
      ...(await serverSideTranslationsWithCommon(context.locale, [
        "search_header",
        "search_page_search_form",
        "map_view",
        "multi_select_combobox",
      ])),
    },
    revalidate: 10,
  };
}
