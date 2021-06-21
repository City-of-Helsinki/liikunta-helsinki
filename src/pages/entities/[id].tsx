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

import initializeCmsApollo from "../../client/cmsApolloClient";
import { getQlLanguage } from "../../client/utils";
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
import { Item, Recommendation } from "../../types";

const image =
  "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg";
const content = `Donec et mollis arcu. Pellentesque risus nulla, ornare in lobortis sit amet, venenatis eget orci. Vivamus vitae aliquam neque. Etiam suscipit nulla non nibh sodales, at condimentum ipsum sodales. Curabitur scelerisque semper tortor maximus posuere. Aliquam mollis erat at neque rutrum maximus. Praesent sagittis leo et mi porttitor ornare. 

Duis tortor massa, blandit nec mauris ac, placerat feugiat velit. Ut aliquet tempus mi condimentum porttitor. Sed volutpat et sem at imperdiet. Integer et sapien orci. Aliquam ac scelerisque lorem. Aenean faucibus sodales vehicula. Duis at iaculis dolor, a porta risus. In ut cursus orci, at lacinia quam. Nulla et purus auctor nulla tempus cursus.

Vivamus varius, elit sit amet vulputate tincidunt, est tellus finibus est, id efficitur est lorem vitae purus. Sed interdum turpis ex, pretium pharetra ex varius sed. Ut turpis neque, volutpat quis dolor vitae, rutrum facilisis ante. Ut finibus nec tellus lobortis molestie. Suspendisse nec ligula mi. Nunc lobortis aliquet mi quis aliquet.`;
const shortDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu interdum sem, ut gravida est. Cras tempor gravida eros nec suscipit. Nunc elementum tellus in rhoncus lobortis.";

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

export default function EntityPage() {
  const router = useRouter();
  const search = useSearch();

  const keywords = ["Uimaranta", "Uinti", "Ulkoilupaikat"];
  const infoLines = [
    {
      id: "sidpjo12",
      icon: <IconLocation />,
      info: "Eiranranta 3, Helsinki",
    },
  ];
  const name = "Eiran uimaranta";
  const streetAddress = "Eiranranta 3";
  const recommendationItems = getRecommendationsAsItems(
    mockRecommendations,
    router
  );

  return (
    <Page
      title="Liikunta-Helsinki"
      description="Liikunta-helsinki"
      navigationVariant="white"
    >
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
            <InfoBlock
              icon={<IconClock />}
              name="Nyt auki"
              contents={["Kausi 1.6-9.8.2020"]}
            />
            <InfoBlock
              icon={<IconQuestionCircle />}
              name="Veden tiedot"
              contents={[
                "+22 astetta, ei sinilevää\nPäivitetty 21.7.2021 klo 12:12",
              ]}
            />
            <InfoBlock
              icon={<IconLocation />}
              name="Paikka"
              contents={[
                <InfoBlock.List
                  id="address"
                  items={["Eiran uimaranta", streetAddress, "Helsinki"]}
                />,
                <InfoBlock.Link id="map-link" href="#" label="Avaa kartta" />,
              ]}
            />
            <InfoBlock
              icon={<IconInfoCircle />}
              name="Muut tiedot"
              contents={[
                <InfoBlock.List
                  id="contact-details"
                  items={["040 123 4567", "email@email.com"]}
                />,
                <InfoBlock.List
                  id="social-media-links"
                  items={[
                    <InfoBlock.Link
                      external
                      id="web"
                      href="#"
                      label="Verkkosivu"
                    />,
                    <InfoBlock.Link
                      external
                      id="fb"
                      href="#"
                      label="Facebook"
                    />,
                    <InfoBlock.Link
                      external
                      id="yt"
                      href="#"
                      label="Youtube"
                    />,
                    <InfoBlock.Link
                      external
                      id="ig"
                      href="#"
                      label="Instagram"
                    />,
                    <InfoBlock.Link
                      external
                      id="tw"
                      href="#"
                      label="Twitter"
                    />,
                  ]}
                />,
              ]}
            />
            <InfoBlock
              icon={<IconMap />}
              name="Löydä perille"
              contents={[
                <InfoBlock.List
                  id="directions-hsl"
                  items={[
                    <InfoBlock.Link
                      external
                      id="hsl"
                      href="#"
                      label="Reittiohjeet (HSL)"
                    />,
                  ]}
                />,
                <InfoBlock.List
                  id="directions-google"
                  items={[
                    <InfoBlock.Link
                      external
                      id="google"
                      href="#"
                      label="Reittiohjeet (Google)"
                    />,
                  ]}
                />,
              ]}
            />
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
          </aside>
          <div className={styles.content}>
            <Text variant="h3">Kuvaus</Text>
            <Text variant="body-l" className={styles.description}>
              {shortDescription}
            </Text>
            {content.split("\n\n").map((paragraph) => (
              <Text key={paragraph.substr(0, 10)} variant="body-l">
                {paragraph}
              </Text>
            ))}
            <Text variant="h3">Jaa liikunta</Text>
            <ShareLinks />
            <Hr />
            <MapBox
              title="Sijainti"
              serviceMapUrl="https://palvelukartta.hel.fi/fi/embed/unit/7255"
              placeName={name}
              placeAddress={streetAddress}
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
  const language = getQlLanguage(context.locale ?? context.defaultLocale);

  await cmsClient.pageQuery({
    nextContext: context,
    variables: {
      languageCode: language,
      languageCodeFilter: language,
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
    },
    revalidate: 10,
  };
}
