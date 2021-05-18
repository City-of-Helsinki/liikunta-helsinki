import React from "react";
import classNames from "classnames";

import styles from "./list.module.scss";

type Props = {
  items: React.ReactElement[];
  variant?: "default" | "collection-grid" | "tight";
};

function List({ items, variant = "default" }: Props) {
  return (
    <ul className={classNames(styles.list, styles[variant])}>
      {items.map((node: React.ReactElement) => (
        <li key={node.key} className={styles.item}>
          {node}
        </li>
      ))}
    </ul>
  );
}

export default List;
