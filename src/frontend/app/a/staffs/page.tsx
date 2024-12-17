import React from 'react';
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/Admin/side-nav"
import { Button } from "@/components/ui/button"
import { ChevronDown, ArrowUpDown, Plus, Search } from 'lucide-react';

const StaffsPage = () => {
  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-64 mt-4">
        <div className="w-full text-sm text-left rtl:text-right text-black">
          <div className="relative flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 h-14">
            <div className="absolute left-0 top-0">
              <div className="form-group inline-flex items-center text-gray-500 bg-white border border-gray-30 rounded-lg text-sm py-1.5">
                <select
                  id="gender"
                  name="gender"
                  className="form-input"
                  required
                >
                  <option value="">Choose staff status</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="absolute left-1/4 top-0">
              <input type="text" id="table-search" className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for staff's name"></input>
            </div>
            <div className="absolute top-0 right-20">
              <Button variant="outline" className="border-blue-500 bg-blue-500 hover:bg-blue-700 text-white hover:text-white">Add Staff</Button>
            </div>
          </div>
          <table className="border-collapse border border-black rounded-lg">
            <thead className="text-xs text-black bg-red-300">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Staff's name
                </th>
                <th scope="col" className="px-6 py-3">
                  Birth date
                </th>
                <th scope="col" className="px-6 py-3">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                  Join date
                    <a href="#"><ArrowUpDown className="w-3 h-3 ms-1.5" /></a>
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">
                  Staff status
                </th>
                <th scope="col" className="px-6 py-3">
                  Branch name
                </th>
                <th scope="col" className="px-6 py-3">
                  Department name
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="odd:bg-white even:bg-gray-100 text-xs text-black">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  Nguyen Nguyen
                </th>
                <td className="px-6 py-4">
                  14/12/1999
                </td>
                <td className="px-6 py-4">
                  Male
                </td>
                <td className="px-6 py-4">
                  14/2/2019
                </td>
                <td className="px-6 py-4">
                  Staff status
                </td>
                <td className="px-6 py-4">
                  Branch name
                </td>
                <td className="px-6 py-4">
                  Department name
                </td>
                <td className="px-6 py-4">
                  <Button variant="outline" className="text-xs bg-white hover:bg-blue-500 border-blue-500 hover:border-blue-500 text-blue-500 hover:text-white">View & edit</Button>
                  <Button variant="outline" className="ml-2 text-xs bg-white hover:bg-red-600 border-red-600 hover:border-red-600 text-red-600 hover:text-white">Delete</Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default StaffsPage;
