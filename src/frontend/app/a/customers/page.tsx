import React from 'react';
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/side-nav"

const CustomersPage = () => {
  return (
    <>
      <AdminHeader />
      <SideNav />
      <div>
      <span className="font-bold text-4xl">Customers</span>

      <div className="border-dashed border border-zinc-500 w-full h-12 rounded-lg"></div>
      <div className="border-dashed border border-zinc-500 w-full h-64 rounded-lg"></div>
      </div>
    </>
  );
};

export default CustomersPage;
