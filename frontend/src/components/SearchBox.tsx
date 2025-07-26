import { useDebounce } from "@/hook/Debounce";
import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { UseFormsetSetValue } from "react-hook-form";
// interface Props {
//   setValue:UseFormsetSetValue<any>
// }
const SearchBox = ({setValue}) => {
  const [stockName, setStockName] = useState("");
  const debounceSearch = useDebounce(stockName, 500);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState("");
  // const handleChange = (e: FormEvent) => {};

  useEffect(() => {
    if (debounceSearch) {
      handleSearch(debounceSearch);
    }
  }, [debounceSearch]);
  const handleSearch = async (str: string) => {
    setShowList(true);
    try {
      // console.log("Searching for:", str);
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/searchStock?q=${str}`
      );
      // console.log("Search result:", result.data.quotes);
      setResultData(result.data.quotes);
      setShowList(true);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setShowList(true);
      setResultData([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelect = (item: any) => () => {
    setSelectedValue(`${item.symbol},${item.exchange}, ${item.shortname}`);
    setValue('stock',item,{shouldValidate:true});
    setShowList(false);
    setResultData([]);
  };
  const handleshow = () => {
    setShowList(!showList);
  };
  return (
    <div className="w-full mx-auto">
      <div>
        <p
          className=" border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full  p-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white cursor-pointer"
          onClick={handleshow}
        >
          {selectedValue || "Search by stock or symbol or company name"}
        </p>
      </div>

      {showList && (
        <div className="max-w-full  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 z-10">
          {/* Loading state */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
              <FaSearch />
            </div>
            <input
              type="text"
              id="email-address-icon"
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by stock or symbol or company name"
            />
          </div>
          {isLoading && (
            <div className="flex items-center justify-center ">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          )}
          {resultData.length > 0 && (
            <ul className=" space-y-1 text-gray-500 list-none list-inside dark:text-gray-400">
              {resultData.map((item) => (
                <li
                  key={item.symbol}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-lg"
                  onClick={handleSelect(item)}
                >
                  <div className="flex justify-between">
                    <p className="text-blue-500 font-bold">{item.symbol}</p>
                    <p>{item.typeDisp}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-black overflow-hidden">
                      {item.longname || item.shortname}
                    </p>
                    <p>{item.exchange}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
