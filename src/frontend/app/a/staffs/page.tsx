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
              <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                  Choose staff status<ChevronDown className="w-4 h-4 ms-1.5" />
              </button>
              <div id="dropdownRadio" className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="top" style={{position: 'absolute', inset: 'auto auto 0px 0px', margin: '0px', transform: 'translate3d(522.5px, 3847.5px, 0px)',}}>
                  <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                      <li>
                          <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                              <input checked id="filter-radio-example-3" type="radio" value="" name="filter-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
                              <label htmlFor="filter-radio-example-3" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">All status</label>
                          </div>
                      </li>
                  </ul>
              </div>
            </div>
            <div className="absolute left-1/4 top-0">
              <input type="text" id="table-search" className="block p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for staff's name"></input>
            </div>
            <div className="absolute top-0 right-20">
              <Button variant="outline" className="border-gray-300 bg-white hover:bg-slate-100"><Plus /></Button>
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
        <div className="hs-dropdown relative inline-flex">
  <button id="hs-dropdown-default" type="button" className="hs-dropdown-toggle py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
    Actions
    <svg className="hs-dropdown-open:rotate-180 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
  </button>

  <div className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg mt-2 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700 after:h-4 after:absolute after:-bottom-4 after:start-0 after:w-full before:h-4 before:absolute before:-top-4 before:start-0 before:w-full" role="menu" aria-orientation="vertical" aria-labelledby="hs-dropdown-default">
    <div className="p-1 space-y-0.5">
      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
        Newsletter
      </a>
      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
        Purchases
      </a>
      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
        Downloads
      </a>
      <a className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700" href="#">
        Team Account
      </a>
    </div>
  </div>
</div>
      </div>
    </>
  );
};

export default StaffsPage;
