import { GetStaticPropsContext } from "next";
import { IconLocation, IconArrowLeft } from "hds-react";
import { useRouter } from "next/router";
import React from "react";

import initializeCmsApollo from "../../api/cmsApolloClient";
import { getQlLanguage } from "../../api/utils";
import useSearch from "../../hooks/useSearch";
import Keyword from "../../components/keyword/Keyword";
import Page from "../../components/page/Page";
import Text from "../../components/text/Text";
import styles from "./entity.module.scss";

const image =
  "https://liikunta.hkih.production.geniem.io/uploads/sites/2/2021/05/097b0788-hkms000005_km00390n-scaled.jpeg";

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

  return (
    <Page title="Liikunta-Helsinki" description="Liikunta-helsinki">
      <article className={styles.wrapper}>
        <section className={styles.header}>
          <button
            type="button"
            className={styles.backToSearch}
            aria-label="Hakuun"
          >
            <IconArrowLeft aria-hidden="true" />
          </button>
          <div className={styles.headerContent}>
            <img src={image} alt="" className={styles.image} />
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
          </div>
        </section>
        <section>Content</section>
        <footer>
          <div>SoMe</div>
          <div>Map</div>
        </footer>
      </article>
      <aside>Aside</aside>
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
