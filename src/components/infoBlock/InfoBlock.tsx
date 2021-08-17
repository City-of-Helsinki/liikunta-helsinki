import { UrlObject } from "url";

import React from "react";
import { IconLinkExternal, IconAngleRight } from "hds-react";
import classNames from "classnames";

import Link from "../../domain/i18nRouter/Link";
import Text from "../text/Text";
import styles from "./infoBlock.module.scss";

type InfoBlockContentLinkProps = {
  external?: boolean;
  label: string;
  href: string | UrlObject;
};

type InfoBlockContentListProps = {
  items: Array<string | React.ReactElement<InfoBlockContentLinkProps>>;
  inline?: boolean;
};

type InfoBlockContent =
  | React.ReactElement<InfoBlockContentLinkProps>
  | React.ReactElement<InfoBlockContentListProps>
  | string;

function getKey(item: InfoBlockContent): string {
  if (typeof item === "string") {
    return item;
  }

  return item?.key?.toString();
}

function getHrefAsString(href: string | UrlObject): string {
  if (typeof href === "string") {
    return href;
  }

  return `${href.protocol}//${href.pathname}${
    href.search ? `?${href.search}` : ""
  }`;
}

function InfoBlockLink({
  external = false,
  label,
  href,
}: InfoBlockContentLinkProps) {
  if (external) {
    return (
      <a
        href={getHrefAsString(href)}
        className={styles.link}
        rel="noreferrer noopener"
        target="_blank"
      >
        {label} <IconLinkExternal aria-label="Avautuu uudessa välilehdessä" />
      </a>
    );
  }

  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link}>
        <span>{label}</span> <IconAngleRight />
      </a>
    </Link>
  );
}

function InfoBlockList({ items, inline }: InfoBlockContentListProps) {
  const nonEmptyItems = items.filter((item) => item);

  if (nonEmptyItems.length === 0) {
    return null;
  }

  return (
    <ul
      className={classNames(styles.list, {
        [styles.inline]: inline,
      })}
    >
      {nonEmptyItems.map((item) => (
        <li key={getKey(item)}>{item}</li>
      ))}
    </ul>
  );
}

type Props = {
  icon: React.ReactElement;
  name: string;
  contents: InfoBlockContent[];
  target?: "body" | "card";
};

function InfoBlock({ icon, name, contents, target = "body" }: Props) {
  const contentWithoutEmpty = contents.filter((item) => {
    if (typeof item === "string") {
      return Boolean(item);
    }

    const props = item?.props;
    const items = "items" in props ? props?.items : null;

    if (items) {
      const allItemsAreEmpty = items.reduce(
        (acc, item) => acc && item === null,
        true
      );

      return !allItemsAreEmpty;
    }

    return true;
  });

  if (contentWithoutEmpty.length === 0) {
    return null;
  }

  const textVariant = target === "card" ? "body" : "h5";

  return (
    <div className={classNames(styles.infoBlock, styles[target])}>
      <Text as="h4" variant={textVariant} className={styles.name}>
        {icon} {name}
      </Text>
      <ul className={styles.content}>
        {contents.map((content) => (
          <li key={getKey(content)}>{content}</li>
        ))}
      </ul>
    </div>
  );
}

InfoBlock.Link = InfoBlockLink;
InfoBlock.List = InfoBlockList;

export default InfoBlock;
