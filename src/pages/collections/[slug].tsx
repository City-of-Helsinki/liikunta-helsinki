import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { LoadingSpinner } from "hds-react";

import { ItemQueryResult } from "../../types";
import getLiikuntaStaticProps from "../../domain/app/getLiikuntaStaticProps";
import { getQlLanguage } from "../../common/apollo/utils";
import collectionFragment from "../../domain/collections/collectionFragment";
import serverSideTranslationsWithCommon from "../../domain/i18n/serverSideTranslationsWithCommon";
import { getLocaleOrError } from "../../domain/i18n/router/utils";
import SelectedEvents from "../../domain/events/SelectedEvents";
import SearchEvents from "../../domain/events/SearchEvents";
import SelectedVenues from "../../domain/venues/SelectedVenues";
import PaginationContainer from "../../domain/pagination/PaginationContainer";
import Page from "../../common/components/page/Page";
import getPageMetaPropsFromSEO from "../../common/components/page/getPageMetaPropsFromSEO";
import Text from "../../common/components/text/Text";
import Section from "../../common/components/section/Section";
import ShareLinks from "../../common/components/shareLinks/ShareLinks";
import HtmlToReact from "../../common/components/htmlToReact/HtmlToReact";
import CondensedCard from "../../common/components/card/CondensedCard";
import List from "../../common/components/list/List";
import styles from "./collection.module.scss";

type CollectionItemListProps<TData, TVariables> = {
  queryResult: ItemQueryResult<TData, TVariables>;
  title: string;
  pageSize?: number;
  noPagination?: boolean;
};

const TextBodyL = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) =>
  children ? (
    <Text {...props} variant="body-l">
      {children}
    </Text>
  ) : null;

function CollectionItemList<TData = null, TVariables = undefined>({
  title,
  queryResult: {
    loading,
    error,
    fetchMore,
    items,
    pageInfo,
    totalCount,
    previousData,
  },
  pageSize,
  noPagination,
}: CollectionItemListProps<TData, TVariables>) {
  const { t } = useTranslation("collection_page");

  // In case of an error, silently fail.
  if (error) {
    return null;
  }

  if (loading && !previousData) {
    return (
      <Section>
        <LoadingSpinner />
      </Section>
    );
  }

  // In case there are no items
  if (items.length === 0) {
    return null;
  }

  const elements = items.map((item) => (
    <CondensedCard key={item.id} {...item} />
  ));

  return (
    <Section title={title}>
      {!noPagination && (
        <PaginationContainer
          loading={loading}
          fetchMore={fetchMore}
          elements={elements}
          pageInfo={pageInfo}
          totalCount={totalCount}
          pageSize={pageSize}
          showMoreLabel={t("show_more_events")}
          noMoreResultsLabel={t("no_more_events")}
          loadingMoreLabel={t("loading_more_events_label")}
          nMoreResultsLabel={t("n_more_events_label")}
        />
      )}
      {noPagination && <List variant="grid-2" items={elements} />}
    </Section>
  );
}

export const COLLECTION_PAGE_QUERY = gql`
  query CollectionPageQuery($languageCode: LanguageCodeEnum!, $slug: ID!) {
    collection(id: $slug, idType: SLUG) {
      ...collectionFragment
    }
  }

  ${collectionFragment}
`;

const PAGE_SIZE = 10;

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
            <HtmlToReact
              components={{
                p: TextBodyL,
              }}
            >
              {description}
            </HtmlToReact>
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
        if (module.module === "event_selected") {
          return (
            <SelectedEvents
              key={module.title}
              pageSize={PAGE_SIZE}
              events={module.events}
              render={(renderProps) => (
                <CollectionItemList
                  title={module.title}
                  queryResult={renderProps}
                  pageSize={PAGE_SIZE}
                />
              )}
            />
          );
        }

        if (module.module === "event_search") {
          return (
            <SearchEvents
              key={module.title}
              pageSize={PAGE_SIZE}
              url={module.url}
              render={(renderProps) => (
                <CollectionItemList
                  title={module.title}
                  queryResult={renderProps}
                  pageSize={PAGE_SIZE}
                />
              )}
            />
          );
        }

        if (module.module === "locations_selected") {
          return (
            <SelectedVenues
              key={module.title}
              venues={module.locations}
              render={(renderProps) => (
                <CollectionItemList
                  title={module.title}
                  queryResult={renderProps}
                  noPagination
                />
              )}
            />
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
  return getLiikuntaStaticProps(context, async ({ cmsClient }) => {
    await cmsClient.query({
      query: COLLECTION_PAGE_QUERY,
      variables: {
        languageCode: getQlLanguage(context.locale ?? context.defaultLocale),
        slug: context.params.slug,
      },
    });

    return {
      props: {
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale),
          ["collection_page", "share_links"]
        )),
      },
    };
  });
}
