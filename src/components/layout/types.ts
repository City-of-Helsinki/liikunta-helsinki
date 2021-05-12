import React from "react";

import { Language, NavigationItem } from "../../types";

export type LayoutComponentProps = {
  children: React.ReactNode;
  menuItems: NavigationItem[];
  languages: Language[];
};

export type LayoutComponent = React.ComponentType<LayoutComponentProps>;
