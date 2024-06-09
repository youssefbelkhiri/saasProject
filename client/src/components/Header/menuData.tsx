import { Menu } from "@/types/menu";

const menuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 2,
    title: "Pricing",
    path: "/pricing",
    newTab: false,
  },
  {
    id: 3,
    title: "About Us",
    path: "/about",
    newTab: false,
  },
  ,
  {
    id: 4,
    title: "Contact Us",
    path: "/contact",
    newTab: false,
  },
];

const userMenuData: Menu[] = [
  {
    id: 1,
    title: "Home",
    path: "/",
    newTab: false,
  },
  {
    id: 3,
    title: "Exams",
    path: "/exams",
    newTab: false,
  },
  {
    id: 51,
    title: "Students",
    path: "/students",
    newTab: false,
  },
  ,
  {
    id: 51,
    title: "Contact Us",
    path: "/contact",
    newTab: false,
  },
];

export default userMenuData;
