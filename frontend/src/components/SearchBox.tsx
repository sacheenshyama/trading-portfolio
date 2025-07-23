import { useDebounce } from "@/hook/Debounce";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox = () => {
  const [value, setValue] = useState("");
  const debounceSearch = useDebounce(value, 500);
  const [show, setShow] = useState(false);
  // const handleChange = (e: FormEvent) => {};

  // useEffect(() => {
  //   if (debounceSearch) {
  //     handleSearch(debounceSearch);
  //   }
  // }, [debounceSearch]);
  const handleSearch = async (str: string) => {
    setShow(true);
    try {
      const result = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${str}`
      );
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };
  return (
    <div className="w-full mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <FaSearch />
        </div>
        <input
          type="text"
          id="email-address-icon"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search by stock or symbol or company name"
        />
      </div>

      <div className="max-w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        {/* Loading state */}
        <div className="flex items-center justify-center ">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>


      </div>
    </div>
  );
};

export default SearchBox;
