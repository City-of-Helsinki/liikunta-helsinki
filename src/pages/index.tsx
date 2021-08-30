import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

import { Collection, Item } from "../types";
import collectionFragment from "../util/collectionFragment";
import initializeCmsApollo from "../client/cmsApolloClient";
import { getQlLanguage } from "../client/utils";
import mockCategories from "../client/tmp/mockCategories";
import serverSideTranslationsWithCommon from "../domain/i18n/serverSideTranslationsWithCommon";
import seoFragment from "../domain/seo/cmsSeoFragment";
import Page from "../components/page/Page";
import Section from "../components/section/Section";
import List from "../components/list/List";
import LargeCollectionCard from "../components/card/LargeCollectionCard";
import CollectionCard from "../components/card/CollectionCard";
import Hero from "../components/hero/Hero";
import HeroImage from "../components/hero/HeroImage";
import LandingPageSearchForm from "../components/search/landingPageSearchForm/LandingPageSearchForm";
import SearchShortcuts from "../components/searchShortcuts/SearchShortcuts";
import getPageMetaPropsFromSEO from "../components/page/getPageMetaPropsFromSEO";

export const LANDING_PAGE_QUERY = gql`
  query LandingPageQuery($languageCode: LanguageCodeEnum!) {
    landingPage(id: "root", idType: SLUG) {
      id
      desktopImage {
        edges {
          node {
            mediaItemUrl
          }
        }
      }
      translation(language: $languageCode) {
        title
        description
        heroLink
      }
    }
    page(id: "/", idType: URI) {
      translation(language: $languageCode) {
        seo {
          ...seoFragment
        }
      }
      modules {
        ... on LayoutCollection {
          collection {
            ...collectionFragment
          }
        }
      }
    }
  }

  ${seoFragment}
  ${collectionFragment}
`;

function getEventCountForCollection(collection: Collection): number {
  let totalEvents = 0;

  collection.translation.modules.forEach((collectionModule) => {
    if (collectionModule.module === "event_selected") {
      totalEvents = totalEvents + collectionModule.events.length;
    }
  });

  return totalEvents;
}

function getCollectionsAsItems(collections: Collection[] | null): Item[] {
  return collections.map((collection) => ({
    id: collection.id,
    title: collection.translation?.title,
    infoLines: [collection.translation?.description],
    href: {
      pathname: "/collections/[slug]",
      query: { slug: collection.translation?.slug },
    },
    keywords: [
      {
        label: `${getEventCountForCollection(collection)} kpl`,
        href: "",
      },
    ],
    image: collection.translation?.image,
  }));
}

export default function HomePage() {
  const { t } = useTranslation("home_page");
  const router = useRouter();
  const language = getQlLanguage(router.locale ?? router.defaultLocale);
  const { data } = useQuery(LANDING_PAGE_QUERY, {
    variables: {
      languageCode: language,
    },
  });

  const landingPage = data?.landingPage?.translation;
  const collectionItems: Item[] = getCollectionsAsItems(
    data?.page?.modules
      .filter((module) => "collection" in module)
      .map((module) => module.collection) ?? []
  );
  const categories = mockCategories;
  const heroImage =
    data?.landingPage?.desktopImage?.edges[0]?.node?.mediaItemUrl;

  return (
    <Page {...getPageMetaPropsFromSEO(data?.page?.translation?.seo)}>
      {landingPage && (
        <>
          <HeroImage desktopImageUri={heroImage} />
          <Section variant="contained" color="transparent">
            <Hero
              title={landingPage.title}
              description={landingPage.description}
              cta={{
                label: landingPage.heroLink[0],
                href: landingPage.heroLink[1],
              }}
            />
          </Section>
        </>
      )}
      <Section color="transparent">
        <LandingPageSearchForm />
        <SearchShortcuts
          shortcuts={categories.map((category, i) => ({
            id: i.toString(),
            label: category.label,
            icon: category.icon,
          }))}
        />
      </Section>
      <Section title={t("recommended_collections_title")}>
        <List
          variant="collection-grid"
          items={collectionItems.map((item, i) =>
            i === 0 ? (
              <LargeCollectionCard key={item.id} {...item} />
            ) : (
              <CollectionCard key={item.id} {...item} />
            )
          )}
        />
      </Section>
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const cmsClient = initializeCmsApollo();
  const language = getQlLanguage(context.locale ?? context.defaultLocale);

  await cmsClient.pageQuery({
    nextContext: context,
    query: LANDING_PAGE_QUERY,
    variables: {
      languageCode: language,
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslationsWithCommon(context.locale, [
        "home_page",
        "landing_page_search_form",
      ])),
    },
    revalidate: 10,
  };
}
