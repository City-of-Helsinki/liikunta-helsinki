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

  return item.props.id;
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
  return (
    <ul
      className={classNames(styles.list, {
        [styles.inline]: inline,
      })}
    >
      {items.map((item) => (
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
