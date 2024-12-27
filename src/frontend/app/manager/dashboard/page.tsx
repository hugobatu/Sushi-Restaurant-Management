import React from 'react';
import { ManagerHeader } from "@/components/Manager/manager-header"
import { SideNav } from "@/components/Manager/side-nav"

const DashboardPage = () => {
  return (
    <>
      <ManagerHeader />
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
