import React from "react";

import CategoryLink from "../link/CategoryLink";
import List from "../list/List";

type Shortcut = {
  id: string;
  label: string;
  icon: React.ReactNode;
  ontologyTreeIds: string[];
};

type Props = {
  shortcuts: Shortcut[];
};

function SearchShortcuts({ shortcuts }: Props) {
  return (
    <List
      variant="fixed-grid-4"
      gap="s"
      items={shortcuts.map((shortcut) => (
        <CategoryLink
          key={shortcut.id}
          label={shortcut.label}
          icon={shortcut.icon}
          href={`/search${shortcut.ontologyTreeIds.reduce(
            (acc, id, i) => `${acc}${i === 0 ? "?" : "&"}ontologyTreeIds=${id}`,
            ""
          )}`}
        />
      ))}
    />
  );
}

export default SearchShortcuts;
