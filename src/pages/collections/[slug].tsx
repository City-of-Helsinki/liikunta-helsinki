import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import classNames from "classnames";

import initializeCmsApollo from "../../client/cmsApolloClient";
import { getQlLanguage } from "../../client/utils";
import hash from "../../util/hash";
import Page from "../../components/page/Page";
import Text from "../../components/text/Text";
import Section from "../../components/section/Section";
import ShareLinks from "../../components/shareLinks/ShareLinks";
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
  const title = collection?.translation?.title;
  const description = collection?.translation?.description;
  const backgroundColor = collection?.backgroundColor;

  return (
    <Page title={title} description={description} navigationVariant="white">
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
            {description?.split("\n\n").map((paragraph) => (
              <Text key={hash(paragraph.substr(0, 50))} variant="body">
                {paragraph}
              </Text>
            ))}
            <div className={styles.collectionBlockContentSome}>
              <Text as="h2" variant="h4">
                Jaa liikunta
              </Text>
              <ShareLinks />
            </div>
          </div>
          <div className={styles.collectionBlockImage}>
            <Image
              alt=""
              src={collection?.translation?.image}
              layout="responsive"
              objectFit="cover"
              height="100%"
              width="100%"
            />
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
