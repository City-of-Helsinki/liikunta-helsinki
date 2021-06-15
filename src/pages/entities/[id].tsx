import { GetStaticPropsContext } from "next";
import {
  IconLocation,
  IconArrowLeft,
  IconClock,
  IconQuestionCircle,
  IconInfoCircle,
  IconMap,
} from "hds-react";
import React from "react";
import classNames from "classnames";
import { NextRouter, useRouter } from "next/router";
import { ApolloProvider, gql, isApolloError, useQuery } from "@apollo/client";

import { staticGenerationLogger } from "../../logger";
import { Item, Point, Recommendation } from "../../types";
import initializeCmsApollo from "../../client/cmsApolloClient";
import mockRecommendations from "../../client/tmp/mockRecommendations";
import useSearch from "../../hooks/useSearch";
import Keyword from "../../components/keyword/Keyword";
import Page from "../../components/page/Page";
import Text from "../../components/text/Text";
import InfoBlock from "../../components/infoBlock/InfoBlock";
import ShareLinks from "../../components/shareLinks/ShareLinks";
import MapBox from "../../components/mapBox/MapBox";
import Hr from "../../components/hr/Hr";
import Section from "../../components/section/Section";
import List from "../../components/list/List";
import Card from "../../components/card/DefaultCard";
import CondensedCard from "../../components/card/CondensedCard";
import styles from "./entity.module.scss";
import initializeNextApiApolloClient, {
  useNextApiApolloClient,
} from "../../client/nextApiApolloClient";
import humanizeOpeningHoursForWeek from "../../util/time/humanizeOpeningHoursForWeek";

export const ENTITY_QUERY = gql`
  query EntityQuery($id: ID!) {
    venue(id: $id) {
      addressLocality
      dataSource
      description
      email
      id
      isOpen
      image
      infoUrl
      name
      openingHours {
        date
        times {
          startTime
          endTime
          endTimeOnNextDay
          resourceState
          fullDay
        }
      }
      position {
        type
        coordinates
      }
      postalCode
      streetAddress
      telephone
    }
  }
`;

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

function pruneId(idWithSource: string): string {
  const [, id] = idWithSource.split(":");

  return id;
}

type Address = {
  streetName: string;
  zip: string;
  city: string;
};

type DirectionPoint = {
  name: string;
  address: Address;
  point: Point;
};

function renderAddressToString(address: Address): string {
  return [address.streetName, address.zip, address.city]
    .filter((item) => item)
    .join(", ");
}

function getHSLDirection(point?: DirectionPoint): string {
  if (!point) {
    return encodeURIComponent(" ");
  }

  return encodeURIComponent(
    `${renderAddressToString(point.address)}::${point.point.coordinates[0]}${
      point.point.coordinates[1]
    }`
  );
}

function getHSLDirections(
  fromPoint?: DirectionPoint,
  toPoint?: DirectionPoint
) {
  const from = getHSLDirection(fromPoint);
  const to = getHSLDirection(toPoint);

  return `https://reittiopas.hsl.fi/reitti/${from}/${to}`;
}

function getGoogleDirection(point?: DirectionPoint): string {
  if (!point) {
    return "''";
  }

  return `${point.name},+${renderAddressToString(point.address)
    .split(" ")
    .join("+")}`;
}

function getGoogleDirectionsUrl(
  fromPoint?: DirectionPoint,
  toPoint?: DirectionPoint
) {
  const from = getGoogleDirection(fromPoint);
  const to = getGoogleDirection(toPoint);

  return `https://www.google.com/maps/dir/${from}/${to}/`;
}

export function EntityPageContent() {
  const router = useRouter();
  const search = useSearch();
  const locale = router.locale ?? router.defaultLocale;
  const { data, loading, error } = useQuery(ENTITY_QUERY, {
    variables: {
      id: router.query.id,
    },
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
  });

  if (loading || error) {
    return null;
  }

  const id = data?.venue?.id;
  const name = data?.venue?.name;
  const streetAddress = data?.venue?.streetAddress;
  const addressLocality = data?.venue?.addressLocality;
  const image = data?.venue?.image;
  const telephone = data?.venue?.telephone;
  const email = data?.venue?.email;
  const infoUrl = data?.venue?.infoUrl;
  const facebook = data?.venue?.facebook;
  const youtube = data?.venue?.youtube;
  const instagram = data?.venue?.instagram;
  const twitter = data?.venue?.twitter;
  const description = data?.venue?.description;
  const openingHours = humanizeOpeningHoursForWeek(
    data?.venue?.openingHours,
    locale
  );
  const isOpen = data?.venue?.isOpen;

  const simplifiedAddress = [streetAddress, addressLocality].join(", ");
  const directionPoint = {
    name,
    address: {
      streetName: streetAddress,
      zip: data?.venue?.postalCode,
      city: addressLocality,
    },
    point: data?.venue?.position,
  };
  const links = [
    {
      url: infoUrl,
      name: "Verkkosivu",
      id: "web",
    },
    {
      url: facebook,
      name: "Facebook",
      id: "fb",
    },
    {
      url: youtube,
      name: "YouTube",
      id: "yt",
    },
    {
      url: instagram,
      name: "Instagram",
      id: "ig",
    },
    {
      url: twitter,
      name: "Twitter",
      id: "tw",
    },
  ];
  const hslInfoLink = (
    <InfoBlock.Link
      external
      id="hsl"
      href={getHSLDirections(null, directionPoint)}
      label="Reittiohjeet (HSL)"
    />
  );
  const googleInfoLink = (
    <InfoBlock.Link
      external
      id="google"
      href={getGoogleDirectionsUrl(null, directionPoint)}
      label="Reittiohjeet (Google)"
    />
  );
  const infoLines = [
    {
      id: "address",
      icon: <IconLocation />,
      info: simplifiedAddress,
    },
  ];

  // Data that can't be found from the API at this point
  const keywords = null;
  const temperature = null;
  const organizer = null;
  const shortDescription = null;

  const recommendationItems = getRecommendationsAsItems(
    mockRecommendations,
    router
  );

  return (
    <>
      <article className={styles.wrapper}>
        <header className={classNames(styles.layout, styles.header)}>
          <button
            type="button"
            className={styles.backToSearch}
            aria-label="Hakuun"
          >
            <IconArrowLeft aria-hidden="true" />
          </button>
          <div className={styles.image}>
            <img src={image} alt="" />
          </div>
          <div className={styles.content}>
            {keywords && (
              <ul className={styles.keywords}>
                {keywords.map((keyword) => (
                  <li key={keyword}>
                    <Keyword
                      keyword={keyword}
                      onClick={() => {
                        search({
                          ontology: keyword,
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
            )}
            <Text variant="h2">{name}</Text>
            <ul className={styles.headerInfoLines}>
              {infoLines.map((infoLine) => (
                <li key={infoLine.id} className={styles.headerInfoLine}>
                  {infoLine.icon} {infoLine.info}
                </li>
              ))}
            </ul>
          </div>
        </header>
        <div className={classNames(styles.layout, styles.contentSection)}>
          <aside className={styles.aside}>
            {openingHours && (
              <InfoBlock
                icon={<IconClock />}
                name={isOpen ? "Nyt auki" : "Aukioloaika"}
                contents={[openingHours]}
              />
            )}
            {temperature && (
              <InfoBlock
                icon={<IconQuestionCircle />}
                name="Veden tiedot"
                contents={[
                  "+22 astetta, ei sinilevää\nPäivitetty 21.7.2021 klo 12:12",
                ]}
              />
            )}
            <InfoBlock
              icon={<IconLocation />}
              name="Paikka"
              contents={[
                <InfoBlock.List
                  id="address"
                  items={[name, streetAddress, addressLocality]}
                />,
                <InfoBlock.Link
                  id="map-link"
                  href={`/map?entity=${id}`}
                  label="Avaa kartta"
                />,
              ]}
            />
            <InfoBlock
              icon={<IconInfoCircle />}
              name="Muut tiedot"
              contents={[
                <InfoBlock.List
                  id="contact-details"
                  items={[telephone, email]}
                />,
                <InfoBlock.List
                  id="social-media-links"
                  items={links.reduce((acc, link) => {
                    if (!link.url) {
                      return acc;
                    }

                    return [
                      ...acc,
                      <InfoBlock.Link
                        external
                        id={link.id}
                        href={link.url}
                        label={link.name}
                      />,
                    ];
                  }, [])}
                />,
              ]}
            />
            <InfoBlock
              icon={<IconMap />}
              name="Löydä perille"
              contents={[
                <InfoBlock.List id="directions-hsl" items={[hslInfoLink]} />,
                <InfoBlock.List
                  id="directions-google"
                  items={[googleInfoLink]}
                />,
              ]}
            />
            {organizer && (
              <InfoBlock
                icon={<IconLocation />}
                name="Liikunnan tiedot"
                contents={[
                  <InfoBlock.List
                    id="sports-info"
                    items={[
                      "Helsingin kaupunki,",
                      "Kulttuurin ja vapaa-ajan toimiala",
                      "040 123 4567",
                      "email@email.com",
                    ]}
                  />,
                  <InfoBlock.Link
                    id="organizer-link"
                    href="#"
                    label="Katso muut järjestäjän tapahtumat"
                  />,
                ]}
              />
            )}
          </aside>
          <div className={styles.content}>
            <Text variant="h3">Kuvaus</Text>
            {shortDescription && (
              <Text variant="body-l" className={styles.description}>
                {shortDescription}
              </Text>
            )}
            {description?.split("\n\n").map((paragraph) => (
              <Text key={paragraph.substr(0, 10)} variant="body-l">
                {paragraph}
              </Text>
            ))}
            <Text variant="h3">Jaa liikunta</Text>
            <ShareLinks />
            <Hr />
            <MapBox
              title="Sijainti"
              serviceMapUrl={`https://palvelukartta.hel.fi/fi/embed/unit/${pruneId(
                id
              )}`}
              placeName={name}
              placeAddress={simplifiedAddress}
              links={[hslInfoLink, googleInfoLink]}
            />
          </div>
        </div>
      </article>
      <Section title="Seuravat tapahtumat" koros="storm" contentWidth="s">
        <List
          variant="columns-3"
          items={[
            ...recommendationItems,
            ...recommendationItems.slice(0, 2).map(({ id, ...rest }) => ({
              ...rest,
              id: `${id}-b`,
            })),
          ].map((item) => (
            <CondensedCard key={item.id} {...item} />
          ))}
        />
      </Section>
      <Section title="Muuta samankaltaista liikuntaa" color="white">
        <List
          items={recommendationItems.map((item) => (
            <Card key={item.id} {...item} />
          ))}
        />
      </Section>
    </>
  );
}

export default function EntityPage(props) {
  const nextApiApolloClient = useNextApiApolloClient(
    props.initialNextApiApolloState
  );

  return (
    <Page
      title="Liikunta-Helsinki"
      description="Liikunta-helsinki"
      navigationVariant="white"
    >
      <ApolloProvider client={nextApiApolloClient}>
        <EntityPageContent {...props} />
      </ApolloProvider>
    </Page>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const cmsClient = initializeCmsApollo();
  const nextApiClient = initializeNextApiApolloClient();

  try {
    await cmsClient.pageQuery({
      nextContext: context,
    });
    await nextApiClient.query({
      query: ENTITY_QUERY,
      variables: {
        id: context.params.id,
      },
      headers: {
        "Accept-Language": context.locale ?? context.defaultLocale,
      },
    });

    return {
      props: {
        initialApolloState: cmsClient.cache.extract(),
        initialNextApiApolloState: nextApiClient.cache.extract(),
      },
      revalidate: 10,
    };
  } catch (e) {
    staticGenerationLogger.error("Error while generating an entity page:", e);
    if (isApolloError(e)) {
      return {
        props: {
          error: {
            statusCode: 400,
          },
        },
        revalidate: 10,
      };
    }

    throw e;
  }
}
