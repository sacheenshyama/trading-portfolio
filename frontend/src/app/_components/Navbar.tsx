"use client";
import axios from "axios";
import { useDeleteCookie, useHasCookie } from "cookies-next";
import Link from "next/link";
import { redirect, usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { FaDeviantart } from "react-icons/fa";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const hasCookies = useHasCookie();
  const deleteCookie = useDeleteCookie();
  const router = useRouter();
  const path = usePathname();
  const jwtToken = hasCookies("jwtToken");
  useEffect(() => {
    if (jwtToken) {
      setIsLoggedIn(jwtToken);
    }
  }, [jwtToken]);
  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.log("eror in logout:", error);
    } finally {
      deleteCookie("jwtToken");
      localStorage.removeItem("persist:root");
      setIsLoggedIn(false);
      redirect("/home");
    }
  };
  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen flex flex-wrap items-center justify-between mx-auto p-2">
        <Link href="#" className="flex">
          <FaDeviantart className="font-bold text-lg" />
          &nbsp;&nbsp;
          <span className="flex">
            <p className="font-bold text-lg text-green-600">Algo&</p>{" "}
            <p className="font-bold text-lg">Stock</p>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } w-full md:block md:w-auto flex`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            {["home", "portfolio", "activity"].map((item, idx) => (
              <li key={idx} className="font-bold">
                <Link
                  href={`${item}`}
                  className={`block font-bold py-2 px-3 rounded-sm md:p-0 ${
                    item === `/${path}`
                      ? "text-white bg-blue-700 md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500"
                      : "text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                  }`}
                  aria-current={item === "Home" ? "page" : undefined}
                >
                  {item}
                </Link>
              </li>
            ))}{" "}
            <li className="font-bold">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="bg-black text-white rounded-md px-2"
                >
                  Log-out
                </button>
              ) : (
                <button
                  onClick={() => router.push("/sign-in")}
                  className="bg-black text-white rounded-md px-2"
                >
                  sign-in
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
