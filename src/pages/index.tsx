import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import { useTranslation } from "next-i18next";

import getLiikuntaStaticProps from "../domain/app/getLiikuntaStaticProps";
import collectionFragment from "../domain/collections/collectionFragment";
import shortcuts from "../domain/shortcuts/shortcutsData";
import serverSideTranslationsWithCommon from "../domain/i18n/serverSideTranslationsWithCommon";
import { getLocaleOrError } from "../domain/i18n/router/utils";
import seoFragment from "../domain/seo/cmsSeoFragment";
import CollectionGrid from "../domain/collections/collectionsGrid/CollectionGrid";
import getCurrentSeason from "../domain/season/getCurrentSeason";
import { getQlLanguage } from "../common/apollo/utils";
import Page from "../common/components/page/Page";
import Section from "../common/components/section/Section";
import Hero from "../common/components/hero/Hero";
import HeroImage from "../common/components/hero/HeroImage";
import LandingPageSearchForm from "../domain/search/landingPageSearchForm/LandingPageSearchForm";
import SearchShortcuts from "../common/components/searchShortcuts/SearchShortcuts";
import getPageMetaPropsFromSEO from "../common/components/page/getPageMetaPropsFromSEO";

export const LANDING_PAGE_QUERY = gql`
  query LandingPageQuery($languageCode: LanguageCodeEnum!) {
    landingPage(id: "root", idType: SLUG) {
      id
      desktopImage {
        edges {
          node {
            mediaItemUrl
          }
        }
      }
      translation(language: $languageCode) {
        title
        description
        heroLink
      }
    }
    page(id: "/", idType: URI) {
      translation(language: $languageCode) {
        seo {
          ...seoFragment
        }
      }
      modules {
        ... on LayoutCollection {
          collection {
            ...collectionFragment
          }
        }
      }
    }
  }

  ${seoFragment}
  ${collectionFragment}
`;

export default function HomePage() {
  const { t } = useTranslation("home_page");
  const { t: tShortcuts } = useTranslation("hardcoded_shortcuts");
  const router = useRouter();
  const language = getQlLanguage(router.locale ?? router.defaultLocale);
  const { data } = useQuery(LANDING_PAGE_QUERY, {
    variables: {
      languageCode: language,
    },
  });

  const landingPage = data?.landingPage?.translation;
  const collections =
    data?.page?.modules
      .filter((module) => "collection" in module)
      .map((module) => module.collection) ?? [];
  const heroImage =
    data?.landingPage?.desktopImage?.edges[0]?.node?.mediaItemUrl;
  const currentSeason = getCurrentSeason();

  return (
    <Page {...getPageMetaPropsFromSEO(data?.page?.translation?.seo)}>
      {landingPage && (
        <>
          <HeroImage desktopImageUri={heroImage} />
          <Section variant="contained" color="transparent">
            <Hero
              title={landingPage.title}
              description={landingPage.description}
              cta={{
                label: landingPage.heroLink[0],
                href: landingPage.heroLink[1],
              }}
            />
          </Section>
        </>
      )}
      <Section color="transparent">
        <LandingPageSearchForm />
        <SearchShortcuts
          shortcuts={shortcuts
            .filter((shortcut) => shortcut.seasons.includes(currentSeason))
            .map((shortcut) => ({
              id: shortcut.id,
              label: tShortcuts(shortcut.id),
              icon: shortcut.icon,
              ontologyTreeIds: shortcut.ontologyTreeIds,
            }))}
        />
      </Section>
      <Section title={t("recommended_collections_title")}>
        <CollectionGrid collections={collections} />
      </Section>
    </Page>
  );
}

export async function getStaticProps(context: GetStaticPropsContext) {
  return getLiikuntaStaticProps(context, async ({ cmsClient }) => {
    await cmsClient.query({
      query: LANDING_PAGE_QUERY,
      variables: {
        languageCode: getQlLanguage(context.locale ?? context.defaultLocale),
      },
    });

    return {
      props: {
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale),
          [
            "home_page",
            "landing_page_search_form",
            "collection_count_label",
            "hardcoded_shortcuts",
          ]
        )),
      },
    };
  });
}
