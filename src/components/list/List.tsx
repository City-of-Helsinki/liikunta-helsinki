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
    | "tight"
    | "searchResult"
    | "grid-3"
    | "grid-2";
  li?: React.ComponentType<ListItemProps>;
};

function List({ items, variant = "default", li: Li }: Props) {
  return (
    <ul className={classNames(styles.list, styles[variant])}>
      {items.map((node: React.ReactElement, index: number) =>
        React.createElement(
          Li ?? "li",
          { key: node.key, className: styles.item, index },
          node
        )
      )}
    </ul>
  );
}

export default List;
