import React from "react";
import SigninForm from "./_components/SigninForm";
import Link from "next/link";
import Navbar from "@/app/_components/Navbar";

const page = () => {
  return (
    <>
      <div className="h-screen overflow-hidden m-auto">
        <Navbar />
        <hr className="text-gray-200  w-[100vw] mb-4" />
        <div className="h-full flex justify-center items-center">
          <div>
            <h2 className=" text-center text-3xl font-extrabold text-gray-900">
              Ready to see green? Enter your credentials.
            </h2>
           
         
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                   <h2 className="text-center text-2xl font-bold">Sign In</h2>
                <SigninForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
