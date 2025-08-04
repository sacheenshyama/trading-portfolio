import Navbar from "@/app/_components/Navbar";
import React from "react";
import Logs from "./_components/Logs";

const Page = () => {
  return (
    <div>
      <Navbar />
      <hr className="text-gray-200 w-[100vw] mb-4" />

      <div className="flex justify-center">
        <Logs />
      </div>
    </div>
  );
};

export default Page;
