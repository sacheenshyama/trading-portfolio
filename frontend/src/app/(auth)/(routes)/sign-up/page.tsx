import React from "react";
import SignupForm from "./_components/SignupForm";
import Navbar from "@/app/_components/Navbar";

const page = () => {
  return (
    <div className="h-screen overflow-hidden m-auto">
      <Navbar />
      <hr className="text-gray-200  w-[100vw] mb-4" />
      <div className="h-full flex justify-center items-center">
        <div>
          <h2 className=" text-center text-3xl font-extrabold text-gray-900">
            It takes 30 seconds to sign up, a lifetime to grow wealth.
          </h2>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
             
              <SignupForm />
            </div>
          </div>
        </div>{" "}
      </div>
    </div>
  );
};

export default page;
