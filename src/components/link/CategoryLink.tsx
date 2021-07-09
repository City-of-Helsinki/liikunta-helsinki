import { UrlObject } from "url";

import classNames from "classnames";
import { IconAngleRight } from "hds-react";
import React from "react";

import Link from "../../domain/i18nRouter/Link";
import styles from "./categoryLink.module.scss";

type Props = {
  className?: string;
  icon: React.ReactNode;
  label?: string;
  href: string | UrlObject;
};

const CategoryLink = ({ className, icon, href, label }: Props) => {
  return (
    <div className={classNames(styles.categoryLink, className)}>
      <Link href={href}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a>
          {icon}
          <span>{label}</span>
          <IconAngleRight aria-hidden />
        </a>
      </Link>
    </div>
  );
};

export default CategoryLink;
