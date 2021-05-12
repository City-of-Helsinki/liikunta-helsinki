import classNames from "classnames";
import React from "react";

import styles from "./keyword.module.scss";

type Props = {
  blackOnMobile?: boolean;
  color?: "engelLight50" | "tramLight20";
  hideOnMobile?: boolean;
  keyword: string;
  onClick: () => void;
};

const Keyword = ({
  blackOnMobile,
  color,
  hideOnMobile,
  keyword,
  onClick,
}: Props) => {
  const handleClick = (ev: React.MouseEvent) => {
    ev.preventDefault();
    onClick();
  };

  return (
    <button
      className={classNames(styles.keyword, color && styles[color], {
        [styles.blackOnMobile]: blackOnMobile,
        [styles.hideOnMobile]: hideOnMobile,
      })}
      onClick={handleClick}
      type="button"
    >
      {keyword}
    </button>
  );
};

export default Keyword;
