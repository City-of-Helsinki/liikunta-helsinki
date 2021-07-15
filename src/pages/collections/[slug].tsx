import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import classNames from "classnames";

import initializeCmsApollo from "../../client/cmsApolloClient";
import { getQlLanguage } from "../../client/utils";
import Page from "../../components/page/Page";
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
        seo {
          title
          description
          openGraphDescription
          openGraphTitle
          openGraphType
          twitterDescription
          twitterTitle
          socialImage {
            uri
          }
        }
      }
    }
  }
`;

export default function CollectionsPage() {
  const router = useRouter();
  const { data } = useQuery(COLLECTION_PAGE_QUERY, {
    variables: {
      languageCode: getQlLanguage(router.locale ?? router.defaultLocale),
      slug: router.query.slug,
    },
  });

  const collection = data?.collection;
  const metaTitle = collection?.translation?.seo?.title;
  const metaDescription = collection?.translation?.seo?.description;
  const title = collection?.translation?.title;
  const description = collection?.translation?.description;
  const openGraphDescription = collection?.translation?.openGraphDescription;
  const openGraphTitle = collection?.translation?.openGraphTitle;
  const openGraphType = collection?.translation?.openGraphType;
  const twitterDescription = collection?.translation?.twitterDescription;
  const twitterTitle = collection?.translation?.twitterTitle;
  const backgroundColor = collection?.backgroundColor;
  const metaImage = collection?.translation?.socialImage?.uri;
  const image = collection?.translation?.image;

  return (
    <Page
      navigationVariant="white"
      title={metaTitle}
      description={metaDescription}
      openGraphTitle={openGraphTitle}
      openGraphDescription={openGraphDescription}
      openGraphType={openGraphType}
      twitterTitle={twitterTitle}
      twitterDescription={twitterDescription}
      image={metaImage}
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
                Jaa liikunta
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
    },
    revalidate: 10,
  };
}