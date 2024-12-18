'use client';
import React, { useState } from 'react';
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/Admin/side-nav"
import { Button } from "@/components/ui/button"
import FireStaffModal from "@/components/Admin/fire-staff-modal"
import AddStaffModal from "@/components/Admin/add-staff-modal"
import { ChevronDown, ArrowUpDown, Plus, Search } from 'lucide-react';

const StaffsPage = () => {
  const [openFire, setOpenFire] = useState<boolean>(false);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
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
                  <option value="">All staff status</option>
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                </select>
              </div>
            </div>
            <div className="absolute left-1/4 top-0">
              <input type="text" id="table-search" className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for staff name"></input>
            </div>
            <div className="absolute left-0 top-12">
              <table className="table-fixed border-collapse border outline outline-1 outline-gray-300 overflow-hidden text-center rounded-lg">
                <thead className="text-xs text-black bg-white">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      <div className="flex items-center">
                      Staff ID
                        <a href="#"><ArrowUpDown className="w-3 h-3 ms-1.5" /></a>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Staff name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Birth date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Phone number
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Gender
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
                  <tr className="even:bg-white odd:bg-gray-100 text-xs text-black">
                    <td className="px-6 py-4">
                      9876543210
                    </td>
                    <td className="px-6 py-4">
                      Nguyen Nguyen
                    </td>
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
                    <td className="relative px-6 py-4 w-72">
                      <div className="absolute top-1 left-4">
                        <Button variant="outline" className="text-xs hover:bg-blue-500 border-blue-500 hover:border-blue-500 text-blue-500 hover:text-white">View details</Button>
                      </div>
                      <div className="absolute top-1 left-32">
                        <Button variant="outline" className="text-xs hover:bg-gray-500 border-gray-500 hover:border-gray-500 text-gray-500 hover:text-white">Edit staff</Button>
                      </div>
                      <div className="absolute top-1 left-56">
                        <Button variant="outline" className="text-xs hover:bg-red-600 border-red-600 hover:border-red-600 text-red-600 hover:text-white"
                        onClick={() => setOpenFire(true)}>Fire</Button>
                        <FireStaffModal open={openFire} onClose={() => setOpenFire(false)}>
                          <div className="flex items-center justify-between p-4">
                          <h1 className="text-xl">Do you cofirm firing this staff?</h1>
                          </div>
                          <div className="flex flex-row justify-end">
                            <Button
                              className="border border-neutral-300 rounded-lg py-1.5 px-5
                              bg-blue-500 hover:bg-blue-500 text-white mr-3"
                              onClick={() => setOpenFire(false)}
                            >
                              Fire
                            </Button>
                            <Button
                              className="border border-neutral-300 rounded-lg py-1.5 px-5
                              bg-gray-500 hover:bg-gray-500 text-white ml-2"
                              onClick={() => setOpenFire(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </FireStaffModal>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="absolute top-0 right-20">
              <Button variant="outline" className="border-blue-500 bg-blue-500 hover:bg-blue-700 text-white hover:text-white visible"
              onClick={() => setOpenAdd(true)}
              >Add Staff</Button>
              <AddStaffModal open={openAdd} onClose={() => setOpenAdd(false)}>
                <h1 className="text-xl">Add staff</h1>
                <div className="flex flex-row justify-center">
                  <Button
                    className="border border-neutral-300 rounded-lg py-1.5 px-5
                    bg-blue-500 hover:bg-blue-500 text-white"
                    onClick={() => setOpenAdd(false)}
                  >
                    Add
                  </Button>
                  <Button
                    className="border border-neutral-300 rounded-lg py-1.5 px-5
                    bg-gray-500 hover:bg-gray-500 text-white"
                    onClick={() => setOpenAdd(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </AddStaffModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StaffsPage;
