import { MenuItem } from "../../types";

const menuItems: (MenuItem & { __typename: string })[] = [
  {
    __typename: "MenuItem",
    id: "1",
    order: 0,
    path: "/search",
    target: "",
    title: "Haku",
    url: "/search",
  },
  {
    __typename: "MenuItems",
    id: "3",
    order: 2,
    path: "/liikuntatunnit",
    target: "",
    title: "Liikuntatunnit",
    url: "/liikuntatunnit",
  },
  {
    __typename: "MenuItems",
    id: "2",
    order: 1,
    path: "/liikuntapaikat",
    target: "",
    title: "Liikuntapaikat",
    url: "/liikuntapaikat",
  },
  {
    __typename: "MenuItems",
    id: "4",
    order: 3,
    path: "/ryhmat",
    target: "",
    title: "Ryhmät",
    url: "/ryhmat",
  },
];

export default menuItems;
