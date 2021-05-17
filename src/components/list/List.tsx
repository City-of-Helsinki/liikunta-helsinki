import React from "react";

import { Item } from "../../types";
import styles from "./list.module.scss";

type Props = {
  items: Item[];
  component: React.ComponentType<Item>;
};

function List({ items, component: Component }: Props) {
  return (
    <ul className={styles.list}>
      {items?.map((item) => (
        <li key={item.id} className={styles.item}>
          <Component key={item.id} {...item} />
        </li>
      ))}
    </ul>
  );
}

export default List;
