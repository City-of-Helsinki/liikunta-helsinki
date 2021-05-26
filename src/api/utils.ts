import { Connection, MenuItem } from "../types";

export function getNodes<T>(connection: Connection<T>): T[] {
  return connection.edges.map(({ node }) => node);
}

export function sortMenuItems(menuItemsConnection: { nodes: MenuItem[] }) {
  const menuItems = menuItemsConnection.nodes;
  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order);

  return {
    ...menuItemsConnection,
    nodes: sortedMenuItems,
  };
}

export function getQlLanguage(language: string) {
  return {
    fi: "FI",
    sv: "SV",
    en: "EN",
  }[language];
}
export function getUnifiedSearchLanguage(language: string) {
  return {
    fi: "FINNISH",
    sv: "SWEDISH",
    en: "ENGLISH",
  }[language];
}
