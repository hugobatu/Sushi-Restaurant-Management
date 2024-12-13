import React from 'react';
import { AdminHeader } from "@/components/admin-header"
import { SideNav } from "@/components/side-nav"

const DashboardPage = () => {
  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-60">
        <span className="font-bold text-4xl">Dashboard</span>

        <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
        <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      </div>
    </>
  );
};

export default DashboardPage;
