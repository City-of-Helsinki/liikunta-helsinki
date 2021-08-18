import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

import initializeCmsApollo from "../../client/cmsApolloClient";
import { getQlLanguage } from "../../client/utils";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import SelectedEvents from "../../widgets/selectedEvents/SelectedEvents";
import SearchEvents from "../../widgets/searchEvents/SearchEvents";
import Page from "../../components/page/Page";
import getPageMetaPropsFromSEO from "../../components/page/getPageMetaPropsFromSEO";
import Text from "../../components/text/Text";
import Section from "../../components/section/Section";
import ShareLinks from "../../components/shareLinks/ShareLinks";
import HtmlToReact from "../../components/htmlToReact/HtmlToReact";
import styles from "./collection.module.scss";

export const COLLECTION_PAGE_QUERY = gql`
  query CollectionPageQuery($languageCode: LanguageCodeEnum!, $slug: ID!) {
    collection(id: $slug, idType: SLUG) {
      id
      backgroundColor
      translation(language: $languageCode) {
        title
        description
        image
        modules {
          ... on EventSelected {
            module
            events
            title
          }
          ... on EventSearch {
            module
            title
            url
          }
        }
        seo {
          ...seoFragment
        }
      }
    }
  }

  ${seoFragment}
`;

export default function CollectionsPage() {
  const { t } = useTranslation("collection_page");
  const router = useRouter();
  const { data } = useQuery(COLLECTION_PAGE_QUERY, {
    variables: {
      languageCode: getQlLanguage(router.locale ?? router.defaultLocale),
      slug: router.query.slug,
    },
  });

  const collection = data?.collection;
  const title = collection?.translation?.title;
  const description = collection?.translation?.description;
  const backgroundColor = collection?.backgroundColor;
  const image = collection?.translation?.image;
  const modules = collection?.translation.modules;

  return (
    <Page
      navigationVariant="white"
      {...getPageMetaPropsFromSEO(collection?.translation?.seo)}
    >
      <Section color="white" variant="contained">
        <div className={classNames(styles.collectionBlock)}>
          <div
            className={classNames(
              styles.collectionBlockContent,
              styles[backgroundColor]
            )}
          >
            <Text as="h1" variant="h2">
              {title}
            </Text>
            <HtmlToReact>{description}</HtmlToReact>
            <div className={styles.collectionBlockContentSome}>
              <Text as="h2" variant="h4">
                {t("share_sport")}
              </Text>
              <ShareLinks />
            </div>
          </div>
          <div className={styles.collectionBlockImage}>
            {image && (
              <Image
                alt=""
                src={image}
                layout="responsive"
                objectFit="cover"
                height="100%"
                width="100%"
              />
            )}
          </div>
        </div>
      </Section>
      {modules.map((module) => {
        let content = null;

        if (module.module === "event_selected") {
          content = <SelectedEvents events={module.events} />;
        }

        if (module.module === "event_search") {
          content = <SearchEvents url={module.url} />;
        }

        if (content) {
          return (
            <Section key={module.title} title={module.title}>
              {content}
            </Section>
          );
        }

        return null;
      })}
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
    query: COLLECTION_PAGE_QUERY,
    variables: {
      languageCode: language,
      slug: context.params.slug,
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslationsWithCommon(context.locale, [
        "collection_page",
        "share_links",
      ])),
    },
    revalidate: 10,
  };
}
