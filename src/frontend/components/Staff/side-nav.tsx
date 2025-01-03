"use client";

import React, { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { StaffSideNavItem } from "./staff-item";
import {
  User, Home 
, ClipboardList
} from "lucide-react";

export const SIDENAV_ITEMS: StaffSideNavItem[] = [
  {
    title: "Order Menu",
    path: "/menu",
    icon: <Home size={24} />
  },
  {
    title: "Check Order",
    path: "/staff/checkorder",
    icon: <ClipboardList size={24}/>
  },
  { title: "Staff Reservation",
    path: "/staff/staffreservation",
    icon: <User size = {24}/>

  }
];

export function SideNav() {
  return (
    <div className="md:w-60 pt-10 bg-zinc-100 h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <div className="flex flex-col space-y-2  md:px-6 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}

const MenuItem = ({ item }: { item: StaffSideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const handleClick = () => {
    if (item.title === "Order Menu") {
      localStorage.removeItem("simplifiedItems");
    }
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={() => {
              toggleSubMenu();
              handleClick();
            }}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-zinc-100 w-full justify-between hover:bg-zinc-200 ${
              pathname.includes(item.path) ? "bg-zinc-200" : ""
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl  flex">{item.title}</span>
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    <span>{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          onClick={handleClick}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-zinc-200 ${
            item.path === pathname ? "bg-zinc-100" : ""
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
