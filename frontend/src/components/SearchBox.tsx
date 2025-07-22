import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  return (
    <form className="w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <FaSearch />
        </div>
        <input
          type="text"
          id="email-address-icon"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search by stock or symbol or company name"
        />
      </div>
    </form>
  );
};

export default SearchBox;
