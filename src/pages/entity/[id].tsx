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

import initializeCmsApollo from "../../api/cmsApolloClient";
import { getQlLanguage } from "../../api/utils";
import useSearch from "../../hooks/useSearch";
import Keyword from "../../components/keyword/Keyword";
import Page from "../../components/page/Page";
import Text from "../../components/text/Text";
import InfoBlock from "../../components/infoBlock/InfoBlock";
import styles from "./entity.module.scss";

const image =
  "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg";
const content = `Donec et mollis arcu. Pellentesque risus nulla, ornare in lobortis sit amet, venenatis eget orci. Vivamus vitae aliquam neque. Etiam suscipit nulla non nibh sodales, at condimentum ipsum sodales. Curabitur scelerisque semper tortor maximus posuere. Aliquam mollis erat at neque rutrum maximus. Praesent sagittis leo et mi porttitor ornare. 

Duis tortor massa, blandit nec mauris ac, placerat feugiat velit. Ut aliquet tempus mi condimentum porttitor. Sed volutpat et sem at imperdiet. Integer et sapien orci. Aliquam ac scelerisque lorem. Aenean faucibus sodales vehicula. Duis at iaculis dolor, a porta risus. In ut cursus orci, at lacinia quam. Nulla et purus auctor nulla tempus cursus.

Vivamus varius, elit sit amet vulputate tincidunt, est tellus finibus est, id efficitur est lorem vitae purus. Sed interdum turpis ex, pretium pharetra ex varius sed. Ut turpis neque, volutpat quis dolor vitae, rutrum facilisis ante. Ut finibus nec tellus lobortis molestie. Suspendisse nec ligula mi. Nunc lobortis aliquet mi quis aliquet.`;
const shortDescription =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam eu interdum sem, ut gravida est. Cras tempor gravida eros nec suscipit. Nunc elementum tellus in rhoncus lobortis.";

export default function EntityPage() {
  const search = useSearch();

  const keywords = ["Uimaranta", "Uinti", "Ulkoilupaikat"];
  const infoLines = [
    {
      id: "sidpjo12",
      icon: <IconLocation />,
      info: "Eiranranta 3, Helsinki",
    },
  ];

  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki">
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
            <Text variant="h2">Eiran uimaranta</Text>
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
                  key="address"
                  items={["Eiran uimaranta", "Eiranranta 3", "Helsinki"]}
                />,
                <InfoBlock.Link key="link" href="" label="Avaa kartta" />,
              ]}
            />
            <InfoBlock
              icon={<IconInfoCircle />}
              name="Muut tiedot"
              contents={[
                <InfoBlock.List
                  key="address"
                  items={["040 123 4567", "email@email.com"]}
                />,
                <InfoBlock.List
                  key="address"
                  items={[
                    <InfoBlock.Link key="web" href="" label="Verkkosivu" />,
                    <InfoBlock.Link key="fb" href="" label="Facebook" />,
                    <InfoBlock.Link key="yt" href="" label="Youtube" />,
                    <InfoBlock.Link key="ig" href="" label="Instagram" />,
                    <InfoBlock.Link key="tw" href="" label="Twitter" />,
                  ]}
                />,
              ]}
            />
            <InfoBlock
              icon={<IconMap />}
              name="Löydä perille"
              contents={[
                <InfoBlock.List
                  key="directions-hsl"
                  items={[
                    <InfoBlock.Link
                      key="hsl"
                      href=""
                      label="Reittiohjeet (HSL)"
                    />,
                  ]}
                />,
                <InfoBlock.List
                  key="directions-google"
                  items={[
                    <InfoBlock.Link
                      key="google"
                      href=""
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
                  href=""
                  label="Katso muut järjestäjät"
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
              <Text variant="body-l">{paragraph}</Text>
            ))}
          </div>
        </div>
      </article>
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
