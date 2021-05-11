type MenuItem = {
  id: string;
  order: number;
  path: string;
  target: string;
  title: string;
  url: string;
};

const menuItems: MenuItem[] = [
  {
    id: "1",
    order: 0,
    path: "/haku",
    target: "",
    title: "Haku",
    url: "/haku",
  },
  {
    id: "3",
    order: 2,
    path: "/liikuntatunnit",
    target: "",
    title: "Liikuntatunnit",
    url: "/liikuntatunnit",
  },
  {
    id: "2",
    order: 1,
    path: "/liikuntapaikat",
    target: "",
    title: "Liikuntapaikat",
    url: "/liikuntapaikat",
  },
  {
    id: "4",
    order: 3,
    path: "/ryhmat",
    target: "",
    title: "Ryhmät",
    url: "/ryhmat",
  },
];

export default menuItems;
