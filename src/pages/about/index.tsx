import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { GetStaticPropsContext } from "next";

import HtmlToReact from "../../components/htmlToReact/HtmlToReact";
import initializeCmsApollo from "../../client/cmsApolloClient";
import getPageMetaPropsFromSEO from "../../components/page/getPageMetaPropsFromSEO";
import { getQlLanguage } from "../../client/utils";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import Page from "../../components/page/Page";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import Section from "../../components/section/Section";
import Text from "../../components/text/Text";

export const ABOUT_PAGE_QUERY = gql`
  query AccessibilityPageQuery($languageCode: LanguageCodeEnum!) {
    page(id: "/about", idType: URI) {
      translation(language: $languageCode) {
        title
        content
        seo {
          ...seoFragment
        }
      }
    }
  }
  ${seoFragment}
`;

export default function AboutPage() {
  const router = useRouter();
  const language = getQlLanguage(router.locale ?? router.defaultLocale);
  const { data } = useQuery(ABOUT_PAGE_QUERY, {
    variables: {
      languageCode: language,
    },
  });
  const title = data?.page?.translation?.title;
  const content = data?.page?.translation?.content;

  return (
    <Page {...getPageMetaPropsFromSEO(data?.page?.translation?.seo)}>
      <Section
        variant="contained"
        color="white"
        contentWidth="s"
        rowGap="tight"
      >
        <Text variant="h1">{title}</Text>
        <HtmlToReact>{content}</HtmlToReact>
      </Section>
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const cmsClient = initializeCmsApollo();
  const language = getQlLanguage(context.locale ?? context.defaultLocale);

  await cmsClient.pageQuery({
    nextContext: context,
    query: ABOUT_PAGE_QUERY,
    variables: {
      languageCode: language,
    },
  });

  return {
    props: {
      initialApolloState: cmsClient.cache.extract(),
      ...(await serverSideTranslationsWithCommon(context.locale)),
    },
    revalidate: 10,
  };
}
