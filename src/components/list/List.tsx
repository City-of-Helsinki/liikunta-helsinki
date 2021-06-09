import React from "react";
import classNames from "classnames";

import styles from "./list.module.scss";

type Props = {
  items: React.ReactElement[];
  variant?:
    | "default"
    | "collection-grid"
    | "tight"
    | "searchResult"
    | "columns-3";
};

function List({ items, variant = "default" }: Props) {
  return (
    <ul
      className={classNames({
        [styles.list]: variant !== "columns-3",
        [styles[variant]]: variant !== "columns-3",
        [styles["columns-3"]]: variant === "columns-3",
      })}
    >
      {items.map((node: React.ReactElement) => (
        <li key={node.key} className={styles.item}>
          {node}
        </li>
      ))}
    </ul>
  );
}

export default List;
