import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="max-w-full max-h-full mx-auto pt-4 pb-4">{children}</div>
  );
};

export default HomeLayout;
