import { UrlObject } from "url";

import React from "react";
import { IconLinkExternal, IconAngleRight, useAccordion } from "hds-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";

import Link from "../../../domain/i18n/router/Link";
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

type InfoBlockCollapseProps = {
  icon: React.ReactElement;
  items: Array<string | React.ReactElement>;
  className?: string;
  title: string;
  titleClassName?: string;
};

type InfoBlockContent =
  | React.ReactElement<InfoBlockContentLinkProps>
  | React.ReactElement<InfoBlockContentListProps>
  | React.ReactElement<InfoBlockCollapseProps>
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
  const { t } = useTranslation("info_block");

  if (external) {
    return (
      <a
        href={getHrefAsString(href)}
        className={styles.link}
        rel="noreferrer noopener"
        target="_blank"
      >
        {label} <IconLinkExternal aria-label={t("link.opens_in_new_tab")} />
      </a>
    );
  }

  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a className={styles.link} onMouseUp={(e) => e.stopPropagation()}>
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

function InfoBlockCollapse({
  items,
  icon,
  className,
  title,
  titleClassName,
}: InfoBlockCollapseProps) {
  const { isOpen, buttonProps, contentProps } = useAccordion({
    initiallyOpen: false,
  });
  const nonEmptyItems = items.filter((item) => item);

  if (nonEmptyItems.length === 0) {
    return null;
  }

  return (
    <div
      className={[styles.collapse, className, isOpen ? styles.isOpen : ""].join(
        " "
      )}
    >
      <button
        aria-expanded={isOpen}
        className={titleClassName}
        {...buttonProps}
      >
        {title} {icon}
      </button>

      <div aria-hidden={!isOpen} {...contentProps}>
        {items}
      </div>
    </div>
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
InfoBlock.Collapse = InfoBlockCollapse;

export default InfoBlock;
