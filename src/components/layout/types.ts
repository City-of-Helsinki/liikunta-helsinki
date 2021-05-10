import React from "react";

import { Language, NavigationItem } from "../../types";

export type LayoutComponentProps = {
  children: React.ReactNode;
  navigationItems: NavigationItem[];
  languages: Language[];
};

export type LayoutComponent = React.ComponentType<LayoutComponentProps>;
