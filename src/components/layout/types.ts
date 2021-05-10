import { NavigationItem } from "../../types";

export type LayoutComponentProps = {
  children: React.ReactNode;
  navigationItems: NavigationItem[];
};

export type LayoutComponent = React.ComponentType<LayoutComponentProps>;
