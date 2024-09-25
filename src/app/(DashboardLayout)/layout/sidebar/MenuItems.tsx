import {
  IconAperture,
  IconCopy,
  IconFile,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Manajemen",
  },
  {
    id: uniqueId(),
    title: "Tracing Klien",
    icon: IconUserPlus,
    href: "/peoples",
  },
  {
    id: uniqueId(),
    title: "Manage Blogs",
    icon: IconTypography,
    href: "/blogs",
  },
  {
    id: uniqueId(),
    title: "Manage Proyek",
    icon: IconFile,
    href: "/inquiries",
  },
  {
    id: uniqueId(),
    title: "Manage Comments",
    icon: IconCopy,
    href: "/comments",
  },
  // {
  //   navlabel: true,
  //   subheader: "Auth",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Login",
  //   icon: IconLogin,
  //   href: "/authentication/login",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Register",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
  // {
  //   navlabel: true,
  //   subheader: "Extra",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Sample Page",
  //   icon: IconAperture,
  //   href: "/sample-page",
  // },
];

export default Menuitems;
