import { UrlObject } from "url";

import classNames from "classnames";
import React from "react";

import Link from "../../../domain/i18n/router/Link";
import styles from "./keyword.module.scss";

type Props = {
  blackOnMobile?: boolean;
  color?: "engelLight50" | "tramLight20" | "black";
  hideOnMobile?: boolean;
  keyword: string | JSX.Element;
  href: string | UrlObject;
  icon?: React.ComponentType<{
    className?: string;
  }>;
  "aria-label"?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const Keyword = ({
  blackOnMobile,
  color,
  hideOnMobile,
  keyword,
  href,
  icon: Icon,
  ...rest
}: Props) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        {...rest}
        className={classNames(styles.keyword, color && styles[color], {
          [styles.blackOnMobile]: blackOnMobile,
          [styles.hideOnMobile]: hideOnMobile,
          [styles.withIcon]: Icon,
        })}
      >
        {Icon && <Icon className={styles.icon} aria-hidden="true" />}
        {keyword}
      </a>
    </Link>
  );
};

export default Keyword;
