import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

import { Collection, Item, Recommendation } from "../types";
import initializeCmsApollo from "../client/cmsApolloClient";
import { getQlLanguage } from "../client/utils";
import mockRecommendations from "../client/tmp/mockRecommendations";
import Page from "../components/page/Page";
import Section from "../components/section/Section";
import List from "../components/list/List";
import Card from "../components/card/DefaultCard";
import LargeCollectionCard from "../components/card/LargeCollectionCard";
import CollectionCard from "../components/card/CollectionCard";
import Hero from "../components/hero/Hero";
import HeroImage from "../components/hero/HeroImage";
import LandingPageSearchForm from "../components/search/landingPageSearchForm/LandingPageSearchForm";
import mockCategories from "../client/tmp/mockCategories";
import SearchShortcuts from "../components/searchShortcuts/SearchShortcuts";

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
    pageBy(uri: "/") {
      modules {
        ... on LayoutCollection {
          collection {
            id
            translation(language: $languageCode) {
              title
              description
              image
            }
          }
        }
      }
    }
  }
`;

function getRecommendationsAsItems(recommendations: Recommendation[]): Item[] {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    href: recommendation.href,
    keywords: recommendation.keywords.map((keyword) => ({
      label: keyword,
      href: `keywords/${encodeURIComponent(keyword)}`,
      isHighlighted: keyword === "Maksuton",
    })),
  }));
}

function getCollectionsAsItems(collections: Collection[] | null): Item[] {
  return collections.map((collection) => ({
    id: collection.id,
    title: collection.translation?.title,
    infoLines: [collection.translation?.description],
    href: {
      pathname: "/collections/[id]",
      query: { id: collection.id },
    },
    keywords: [
      {
        label: "120 kpl",
        href: "",
      },
    ],
    image: collection.translation?.image,
  }));
}

export default function Home() {
  const router = useRouter();
  const language = getQlLanguage(router.locale ?? router.defaultLocale);
  const { data } = useQuery(LANDING_PAGE_QUERY, {
    variables: {
      languageCode: language,
    },
  });

  const recommendationItems: Item[] = getRecommendationsAsItems(
    mockRecommendations
  );
  const landingPage = data?.landingPage?.translation;
  const collectionItems: Item[] = getCollectionsAsItems(
    data?.pageBy?.modules
      .filter((module) => "collection" in module)
      .map((module) => module.collection) ?? []
  );
  const categories = mockCategories;
  const heroImage =
    data?.landingPage?.desktopImage?.edges[0]?.node?.mediaItemUrl;

  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki">
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
      <Section
        title="Suosittelemme"
        cta={{
          label: "Katso kaikki kokoelmat",
          href: "/collections",
        }}
      >
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
      <Section title="Suosittua juuri nyt">
        <List
          items={recommendationItems.map((item) => (
            <Card key={item.id} {...item} />
          ))}
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
    },
    revalidate: 10,
  };
}
