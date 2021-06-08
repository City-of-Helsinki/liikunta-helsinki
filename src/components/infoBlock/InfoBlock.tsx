import React from "react";
import Link from "next/link";
import { IconLinkExternal, IconAngleRight } from "hds-react";

import Text from "../text/Text";
import styles from "./infoBlock.module.scss";

type InfoBlockContentLinkProps = {
  external?: boolean;
  label: string;
  href: string;
  // eslint-disable-next-line react/no-unused-prop-types
  key: string;
};

function InfoBlockLink({
  external = false,
  label,
  href,
}: InfoBlockContentLinkProps) {
  if (external) {
    return (
      <a href={href} rel="noreferrer noopener" target="_blank">
        {label} <IconLinkExternal />
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

function getKey(
  item: string | React.ReactElement<InfoBlockContentLinkProps>
): string {
  if (typeof item === "string") {
    return item;
  }

  return item.props.key;
}

type InfoBlockContentListProps = {
  items: Array<string | React.ReactElement<InfoBlockContentLinkProps>>;
  // eslint-disable-next-line react/no-unused-prop-types
  key: string;
};

function InfoBlockList({ items }: InfoBlockContentListProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={getKey(item)}>{item}</li>
      ))}
    </ul>
  );
}

type InfoBlockContent =
  | React.ReactElement<InfoBlockContentLinkProps>
  | React.ReactElement<InfoBlockContentListProps>
  | string;

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
        {contents.map((content) => {
          if (typeof content === "string") {
            return <li key={content}>{content}</li>;
          }

          return <li key={content.key}>{content}</li>;
        })}
      </ul>
    </div>
  );
}

InfoBlock.Link = InfoBlockLink;
InfoBlock.List = InfoBlockList;

export default InfoBlock;
