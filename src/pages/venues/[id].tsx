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
import { useRouter } from "next/router";
import { ApolloProvider, gql, isApolloError, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

import { staticGenerationLogger } from "../../domain/logger";
import { Address, Point } from "../../types";
import initializeCmsApollo from "../../client/cmsApolloClient";
import initializeNextApiApolloClient, {
  useNextApiApolloClient,
} from "../../client/nextApiApolloClient";
import useSearch from "../../hooks/useSearch";
import queryPersister from "../../util/queryPersister";
import humanizeOpeningHoursForWeek from "../../util/time/humanizeOpeningHoursForWeek";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import UpcomingEventsSection from "../../widgets/upcomingEventsSection/UpcomingEventsSection";
import Keyword from "../../components/keyword/Keyword";
import Page from "../../components/page/Page";
import Text from "../../components/text/Text";
import InfoBlock from "../../components/infoBlock/InfoBlock";
import ShareLinks from "../../components/shareLinks/ShareLinks";
import MapBox from "../../components/mapBox/MapBox";
import Hr from "../../components/hr/Hr";
import styles from "./venue.module.scss";
import renderAddressToString from "../../util/renderAddressToString";
import hash from "../../util/hash";
import capitalize from "../../util/capitalize";

export const VENUE_QUERY = gql`
  query VenueQuery($id: ID!) {
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
      ontologyWords {
        id
        label
      }
    }
  }
`;

function pruneId(idWithSource: string): string {
  const [, id] = idWithSource.split(":");

  return id;
}

type DirectionPoint = {
  name: string;
  address: Address;
  point: Point;
};

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

export function VenuePageContent() {
  const { t } = useTranslation("venue_page");
  const router = useRouter();
  const id = router.query.id as string;
  const { getSearchRoute } = useSearch();
  const locale = router.locale ?? router.defaultLocale;
  const { data, loading, error } = useQuery(VENUE_QUERY, {
    variables: {
      id: router.query.id,
    },
    context: {
      headers: {
        "Accept-Language": locale,
      },
    },
  });

  const handleBackToSearchClick = () => {
    const persistedQuery = queryPersister.readPersistedQuery();
    let backUrl = "/search";

    if (persistedQuery) {
      backUrl = `${backUrl}?${new URLSearchParams(persistedQuery)}`;
    }

    router.push(backUrl);
  };

  if (loading || error) {
    return null;
  }

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
      name: t("link.info.label"),
      id: "web",
    },
    {
      url: facebook,
      name: t("link.facebook.label"),
      id: "fb",
    },
    {
      url: youtube,
      name: t("link.youtube.label"),
      id: "yt",
    },
    {
      url: instagram,
      name: t("link.instagram.label"),
      id: "ig",
    },
    {
      url: twitter,
      name: t("link.twitter.label"),
      id: "tw",
    },
  ];
  const hslInfoLink = (
    <InfoBlock.Link
      external
      key="hsl"
      href={getHSLDirections(null, directionPoint)}
      label={t("link.hsl_directions.label")}
    />
  );
  const googleInfoLink = (
    <InfoBlock.Link
      external
      key="google"
      href={getGoogleDirectionsUrl(null, directionPoint)}
      label={t("link.google_directions.label")}
    />
  );
  const infoLines = [
    {
      id: "address",
      icon: <IconLocation />,
      info: simplifiedAddress,
    },
  ];
  const keywords = data?.venue?.ontologyWords?.map((ontology) => ({
    label: capitalize(ontology.label),
    id: ontology.id,
  }));

  // Data that can't be found from the API at this point
  const temperature = null;
  const organizer = null;
  const shortDescription = null;

  return (
    <>
      <article className={styles.wrapper}>
        <header className={classNames(styles.layout, styles.header)}>
          <button
            type="button"
            className={styles.backToSearch}
            aria-label="Hakuun"
            onClick={handleBackToSearchClick}
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
                  <li key={keyword.id}>
                    <Keyword
                      keyword={keyword.label}
                      href={getSearchRoute({
                        ontology: keyword.label.toLowerCase(),
                      })}
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
                name={
                  isOpen
                    ? t("block.opening_hours.open_now_label")
                    : t("block.opening_hours.label")
                }
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
              name={t("block.location.label")}
              contents={[
                <InfoBlock.List
                  key="address"
                  items={[name, streetAddress, addressLocality]}
                />,
                <InfoBlock.Link
                  key="map-link"
                  href={`/map?venue=${id}`}
                  label={t("link.map.label")}
                />,
              ]}
            />
            <InfoBlock
              icon={<IconInfoCircle />}
              name={t("block.other_information.label")}
              contents={[
                <InfoBlock.List
                  key="contact-details"
                  items={[telephone, email]}
                />,
                <InfoBlock.List
                  key="social-media-links"
                  items={links.reduce((acc, link) => {
                    if (!link.url) {
                      return acc;
                    }

                    return [
                      ...acc,
                      <InfoBlock.Link
                        external
                        key={link.id}
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
              name={t("block.route.label")}
              contents={[
                <InfoBlock.List key="directions-hsl" items={[hslInfoLink]} />,
                <InfoBlock.List
                  key="directions-google"
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
                    key="sports-info"
                    items={[
                      "Helsingin kaupunki,",
                      "Kulttuurin ja vapaa-ajan toimiala",
                      "040 123 4567",
                      "email@email.com",
                    ]}
                  />,
                  <InfoBlock.Link
                    key="organizer-link"
                    href="#"
                    label="Katso muut järjestäjän tapahtumat"
                  />,
                ]}
              />
            )}
          </aside>
          <div className={styles.content}>
            <Text variant="h3">{t("content.description")}</Text>
            {shortDescription && (
              <Text variant="body-l" className={styles.description}>
                {shortDescription}
              </Text>
            )}
            {description?.split("\n\n").map((paragraph) => (
              <Text key={hash(paragraph.substr(0, 50))} variant="body-l">
                {paragraph}
              </Text>
            ))}
            <Text variant="h3">{t("share_sport")}</Text>
            <ShareLinks />
            <Hr />
            <MapBox
              title={t("map_box.title")}
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
      <UpcomingEventsSection linkedId={id} />
    </>
  );
}

export default function VenuePage(props) {
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
        <VenuePageContent {...props} />
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
      query: VENUE_QUERY,
      variables: {
        id: context.params.id,
      },
      context: {
        headers: {
          "Accept-Language": context.locale ?? context.defaultLocale,
        },
      },
    });

    return {
      props: {
        initialApolloState: cmsClient.cache.extract(),
        initialNextApiApolloState: nextApiClient.cache.extract(),
        ...(await serverSideTranslationsWithCommon(context.locale, [
          "venue_page",
          "map_box",
        ])),
      },
      revalidate: 10,
    };
  } catch (e) {
    staticGenerationLogger.error("Error while generating a venue page:", e);
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
