import React from "react";

import CategoryLink from "../link/CategoryLink";
import List from "../list/List";

type Shortcut = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type Props = {
  shortcuts: Shortcut[];
};

function SearchShortcuts({ shortcuts }: Props) {
  return (
    <List
      variant="tight"
      items={shortcuts.map((shortcut, i) => (
        <CategoryLink
          key={shortcut.id}
          label={shortcut.label}
          icon={shortcut.icon}
          href={`/search?category=${shortcut.label.toLowerCase()}`}
        />
      ))}
    />
  );
}

export default SearchShortcuts;
