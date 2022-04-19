import React from "react";
import classNames from "classnames";

import styles from "./list.module.scss";

type ListItemProps = {
  className?: string;
  index: number;
};

type Props = {
  items: React.ReactElement[];
  variant?:
    | "default"
    | "collection-grid"
    | "searchResult"
    | "grid-3"
    | "grid-2"
    | "fixed-grid-4"
    | "column";
  gap?: "xs" | "s" | "m" | "l";
  li?: React.ComponentType<ListItemProps>;
  listContainerRef?:
    | React.RefObject<null | HTMLUListElement>
    | ((node?: Element) => void);
};

function List({
  items,
  variant = "default",
  li: Li,
  listContainerRef,
  gap,
}: Props) {
  const ListElement = Li ?? "li";
  return (
    <ul
      ref={listContainerRef}
      className={classNames(styles.list, styles[variant], {
        [styles[`gap-${gap}`]]: gap,
      })}
    >
      {items.map((node: React.ReactElement, index: number) => (
        <ListElement key={node.key} index={index} className={styles.item}>
          {node}
        </ListElement>
      ))}
    </ul>
  );
}

export default List;
