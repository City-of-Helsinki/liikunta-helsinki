import { GetStaticPropsContext } from "next";
import { NextRouter, useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";

import { Collection, Connection, Item, Recommendation } from "../types";
import initializeCmsApollo from "../api/cmsApolloClient";
import { getNodes } from "../api/utils";
import Page from "../components/page/Page";
import Section from "../components/section/Section";
import List from "../components/list/List";
import Card from "../components/card/DefaultCard";
import LargeCollectionCard from "../components/card/LargeCollectionCard";
import CollectionCard from "../components/card/CollectionCard";
import Hero from "../components/hero/Hero";

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
  // The CMS has one collection. Get it, and make 6 copies of it.
  const extendedCollections = Array.from({ length: 7 }, (_, index) => ({
    ...collections[0],
    id: `${collections[0]}-${index}`,
  }));

  return extendedCollections.map((collection) => ({
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
  const landingPage = mockLandingPage;
  const collectionItems: Item[] = getCollectionsAsItems(
    data?.collections ?? emptyConnection
  );

  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki">
      <Hero {...landingPage} />
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

  await cmsClient.pageQuery({
    nextContext: context,
    query: LANDING_PAGE_QUERY,
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      revalidate: 1,
    },
  };
}

const mockLandingPage = {
  title: "Kesän parhaat uimarannat",
  desktopImage: {
    uri:
      "https://finna.fi/Cover/Show?id=hkm.HKMS000005:km00390n&size=master&index=0",
  },
  link: "/tips/uimarannat",
};

const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    keywords: ["Tänään"],
    pre: "12.5.2021, klo 19.00",
    title: "Karanteeniteatteri: Naurua kolmannella (stream)",
    infoLines: [
      "Tiivistämö, Sörnäisten rantatie 22 / Kaasutehtaankatu 1, Helsinki",
      "12€ + palvelumaksu",
    ],
    href: `/event/1`,
    image: "https://api.hel.fi/linkedevents/media/images/naurua3.jpg",
  },
  {
    id: "2",
    keywords: ["Tällä viikolla", "Maksuton"],
    pre: "11 – 25.5.2021",
    title: "Bachin Collegium Musicum",
    infoLines: ["Maunula-talo, Metsäpurontie 4, Helsinki", "Maksuton"],
    href: `/event/2`,
    image:
      "https://api.hel.fi/linkedevents/media/images/t%C3%A4m%C3%A4np%C3%A4iv%C3%A4iset_runot_1200x800.jpg",
  },
  {
    id: "3",
    keywords: ["Tällä viikolla"],
    pre: "15.5.2021, klo 21.00 – 23.00",
    title: "Tiivistämö Comedy Stream: All Female Panel",
    infoLines: [
      "Tiivistämö, Sörnäisten rantatie 22 / Kaasutehtaankatu 1, Helsinki",
      "13,5€",
    ],
    href: `/event/3`,
    image: "https://api.hel.fi/linkedevents/media/images/allfemalepanel05.jpg",
  },
  {
    id: "4",
    keywords: [],
    pre: "16.5.2021, klo 18.00 – 20.00",
    title: "Exit – Kautta aikojen livestream",
    infoLines: ["Internet", "18€"],
    href: `/event/4`,
    image:
      "https://api.hel.fi/linkedevents/media/images/EXIT_FBT_160521_1920x1080.jpg",
  },
];
