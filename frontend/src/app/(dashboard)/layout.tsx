import React from "react";

const portfolioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="max-w-full max-h-full mx-auto pt-4 pb-4">{children}</main>
  );
};

export default portfolioLayout;
