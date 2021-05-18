import { GetStaticPropsContext } from "next";
import { NextRouter, useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

import { Collection, Connection, Item, Recommendation } from "../types";
import initializeCmsApollo from "../api/cmsApolloClient";
import { getNodes } from "../api/utils";
import mockRecommendations from "../api/tmp/mockRecommendations";
import Page from "../components/page/Page";
import Section from "../components/section/Section";
import List from "../components/list/List";
import Card from "../components/card/DefaultCard";
import LargeCollectionCard from "../components/card/LargeCollectionCard";
import CollectionCard from "../components/card/CollectionCard";
import Hero from "../components/hero/Hero";
import HeroImage from "../components/hero/HeroImage";
import LandingPageSearchForm from "../components/search/landingPageSearchForm/LandingPageSearchForm";

export const LANDING_PAGE_QUERY = gql`
  query LandingPageQuery {
    collections(first: 7, where: { language: FI }) {
      edges {
        node {
          id
          title
          description
          image
        }
      }
    }
    landingPageBy(landingPageId: 44) {
      title
      description
      heroLink
      desktopImage {
        mediaItemUrl
      }
    }
  }
`;

const emptyConnection = {
  edges: [],
};

function getRecommendationsAsItems(
  recommendations: Recommendation[],
  router: NextRouter
): Item[] {
  return recommendations.map((recommendation) => ({
    ...recommendation,
    keywords: recommendation.keywords.map((keyword) => ({
      label: keyword,
      onClick: () => {
        router.push(`keywords/${encodeURIComponent(keyword)}`);
      },
      isHighlighted: keyword === "Maksuton",
    })),
  }));
}

function getCollectionsAsItems(
  collectionConnection: Connection<Collection> | null
): Item[] {
  const collections = getNodes<Collection>(collectionConnection);

  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    infoLines: [collection.description],
    href: `/collections/${collection.id}`,
    keywords: [
      {
        label: "120 kpl",
        onClick: () => {
          // pass
        },
      },
    ],
    image: collection.image,
  }));
}

export default function Home() {
  const router = useRouter();
  const { data } = useQuery(LANDING_PAGE_QUERY);

  const recommendationItems: Item[] = getRecommendationsAsItems(
    mockRecommendations,
    router
  );
  const landingPage = data?.landingPageBy;
  const collectionItems: Item[] = getCollectionsAsItems(
    data?.collections ?? emptyConnection
  );

  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki">
      {landingPage && (
        <>
          <HeroImage desktopImageUri={landingPage.desktopImage?.mediaItemUrl} />
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
        <div>Categories</div>
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

  const { data } = await cmsClient.pageQuery({
    nextContext: context,
    query: LANDING_PAGE_QUERY,
  });

  cmsClient.writeQuery({
    query: LANDING_PAGE_QUERY,
    data: {
      ...data,
      // landingPageBy: mockLandingPage,
      // The CMS has one collection. Get it, and make 6 copies of it.
      collections: {
        ...data.collections,
        edges: Array.from({ length: 7 }, (_, index) => ({
          ...data.collections.edges[0],
          node: {
            ...data.collections.edges[0].node,
            id: `${data.collections.edges[0].node.id}-${index}`,
          },
        })),
      },
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      revalidate: 1,
    },
  };
}
