import React from 'react';
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/Admin/side-nav"

const MenuPage = () => {
  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60">
        <span className="font-bold text-4xl">Menu</span>

        <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
        <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      </div>
    </>
  );
};

export default MenuPage;
