import { GetStaticPropsContext } from "next";
import { useTranslation } from "next-i18next";
import { IconFaceSad, IconArrowRight, IconLinkExternal } from "hds-react";
import NextLink from "next/link";

import getLiikuntaStaticProps from "../domain/app/getLiikuntaStaticProps";
import serverSideTranslationsWithCommon from "../domain/i18n/serverSideTranslationsWithCommon";
import { getLocaleOrError } from "../domain/i18n/router/utils";
import Page from "../common/components/page/Page";
import Section from "../common/components/section/Section";
import Text from "../common/components/text/Text";
import List from "../common/components/list/List";
import styles from "./error.module.scss";
import getIsHrefExternal from "../common/utils/getIsHrefExternal";

export async function getStaticProps(context: GetStaticPropsContext) {
  return getLiikuntaStaticProps(context, async () => {
    return {
      props: {
        ...(await serverSideTranslationsWithCommon(
          getLocaleOrError(context.locale),
          ["error_page"]
        )),
      },
    };
  });
}

export default function ErrorPage() {
  const { t } = useTranslation("error_page");

  return (
    <Page
      title={t("meta.title")}
      description={t("meta.description")}
      navigationVariant="white"
      footerVariant="darkGrey"
    >
      <Section>
        <Text variant="h1" className={styles.errorPageTitle}>
          {t("title")}{" "}
          <IconFaceSad
            className={styles.errorPageIcon}
            aria-label={t("icon_with_sad_face_aria_label")}
            size="xl"
          />
        </Text>
        <Text variant="body-l">
          {t("description_1")}
          {"\n"}
          {t("description_2")}
        </Text>
        <List
          variant="column"
          gap="s"
          items={[
            <ErrorPageLink key="homepage" href="/">
              {t("link.homepage.label")}
            </ErrorPageLink>,
            <ErrorPageLink key="feedback" href={t("link.feedback.href")}>
              {t("link.feedback.label")}
            </ErrorPageLink>,
          ]}
        />
      </Section>
    </Page>
  );
}

type ErrorPageLinkProps = {
  href: string;
  children: string;
  target?: string;
};

function ErrorPageLink({ href, children, target }: ErrorPageLinkProps) {
  const { t } = useTranslation("link");

  const isExternal = getIsHrefExternal(href);
  const isOpenInNewTab = target === "_blank";
  const isExternalLabel = isExternal
    ? ` ${t("open_in_external_domain_aria_label")}`
    : "";
  const isOpenInNewTabLabel = isOpenInNewTab
    ? ` ${t("open_in_new_tab_aria_label")}`
    : "";
  const ariaLabel = [children, isExternalLabel, isOpenInNewTabLabel]
    .filter((item) => item)
    .join(" ");

  return (
    <NextLink href={href} passHref>
      <a className={styles.errorPageLink} aria-label={ariaLabel}>
        {children}{" "}
        {isExternal || isOpenInNewTab ? (
          <IconLinkExternal size="m" />
        ) : (
          <IconArrowRight size="m" />
        )}
      </a>
    </NextLink>
  );
}
