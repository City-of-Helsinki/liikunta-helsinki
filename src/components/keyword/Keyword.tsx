import classNames from "classnames";
import React from "react";
import Link from "next/link";

import styles from "./keyword.module.scss";

type Props = {
  blackOnMobile?: boolean;
  color?: "engelLight50" | "tramLight20";
  hideOnMobile?: boolean;
  keyword: string;
  href: string;
};

const Keyword = ({
  blackOnMobile,
  color,
  hideOnMobile,
  keyword,
  href,
}: Props) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={classNames(styles.keyword, color && styles[color], {
          [styles.blackOnMobile]: blackOnMobile,
          [styles.hideOnMobile]: hideOnMobile,
        })}
      >
        {keyword}
      </a>
    </Link>
  );
};

export default Keyword;
