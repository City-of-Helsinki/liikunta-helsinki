import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { GetStaticPropsContext } from "next";

import getLiikuntaStaticProps from "../../domain/app/getLiikuntaStaticProps";
import HtmlToReact from "../../common/components/htmlToReact/HtmlToReact";
import getPageMetaPropsFromSEO from "../../common/components/page/getPageMetaPropsFromSEO";
import { getQlLanguage } from "../../common/apollo/utils";
import seoFragment from "../../domain/seo/cmsSeoFragment";
import Page from "../../common/components/page/Page";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import { getLocaleOrError } from "../../domain/i18n/router/utils";
import Section from "../../common/components/section/Section";
import Text from "../../common/components/text/Text";

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
  return getLiikuntaStaticProps(context, async ({ cmsClient }) => {
    await cmsClient.query({
      query: ABOUT_PAGE_QUERY,
      variables: {
        languageCode: getQlLanguage(context.locale ?? context.defaultLocale),
      },
    });

    return {
      props: {
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale)
        )),
      },
    };
  });
}
