import React from "react";
import { IconAngleRight } from "hds-react";
import classNames from "classnames";

import styles from "./secondaryLink.module.scss";

type Props = React.HTMLProps<HTMLAnchorElement>;

const SecondaryLink = React.forwardRef<HTMLAnchorElement, Props>(
  ({ children, className, ...props }: Props, ref) => {
    return (
      <a
        ref={ref}
        {...props}
        className={classNames(styles.secondaryLink, className)}
      >
        {children} <IconAngleRight size="s" aria-hidden="true" />
      </a>
    );
  }
);

SecondaryLink.displayName = "SecondaryLink";

export default SecondaryLink;
