import React from "react";
import Link from "next/link";
import { IconLinkExternal, IconAngleRight } from "hds-react";
import classNames from "classnames";

import Text from "../text/Text";
import styles from "./infoBlock.module.scss";

type InfoBlockContentLinkProps = {
  external?: boolean;
  label: string;
  href: string;
  // eslint-disable-next-line react/no-unused-prop-types
  id: string;
};

type InfoBlockContentListProps = {
  items: Array<string | React.ReactElement<InfoBlockContentLinkProps>>;
  // eslint-disable-next-line react/no-unused-prop-types
  id: string;
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

  return item?.props?.id;
}

function InfoBlockLink({
  external = false,
  label,
  href,
}: InfoBlockContentLinkProps) {
  if (external) {
    return (
      <a
        href={href}
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
};

function InfoBlock({ icon, name, contents }: Props) {
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

  return (
    <div className={styles.infoBlock}>
      <Text as="h4" variant="h5" className={styles.name}>
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
