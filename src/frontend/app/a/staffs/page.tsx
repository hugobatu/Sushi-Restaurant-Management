import React from 'react';
import { AdminHeader } from "@/components/Admin/admin-header"
import { SideNav } from "@/components/Admin/side-nav"
import { Button } from "@/components/ui/button"

const StaffsPage = () => {
  return (
    <>
      <AdminHeader />
      <SideNav />
      <div className="ml-64 mt-4">
        <div className="w-full text-sm text-left rtl:text-right text-black">
          <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
            <div>
                <button id="dropdownRadioButton" data-dropdown-toggle="dropdownRadio" className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" type="button">
                    Choose staff status
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
                    </svg>
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
            <label htmlFor="table-search" className="sr-only">Search</label>
            <div className="relative right-10 rtl:right-auto">
              <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
              </div>
              <input type="text" id="table-search" className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for staff's name"></input>
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
                    <a href="#">
                    <svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/>
                    </svg></a>
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
              <tr className="odd:bg-white even:bg-gray-200 text-xs text-black">
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
                  <Button variant="outline" className="text-xs bg-white hover:bg-gray-200 border-blue-500 hover:border-blue-700 text-blue-500 hover:text-blue-700">View & edit</Button>
                  <Button variant="outline" className="ml-2 text-xs bg-white hover:bg-gray-200 border-red-500 hover:border-red-700 text-red-500 hover:text-red-70">Delete</Button>
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
