import React from "react";
import classNames from "classnames";

import styles from "./list.module.scss";

type Props = {
  // eslint-disable-next-line no-undef
  items: JSX.Element[];
  variant?: "default" | "collection-grid";
};

function List({ items, variant = "default" }: Props) {
  return (
    <ul className={classNames(styles.list, styles[variant])}>
      {/* eslint-disable-next-line no-undef */}
      {items.map((node: JSX.Element) => (
        <li key={node.key} className={styles.item}>
          {node}
        </li>
      ))}
    </ul>
  );
}

export default List;
