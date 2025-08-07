import PortfolioTable from "@/app/(dashboard)/portfolio/_components/PortfolioTable";
import StockHoldingForm from "./_components/StockHoldingForm";
import Navbar from "@/app/_components/Navbar";

export default function Page() {
  return (
    <>
      <div>
        <Navbar />
        <hr className="text-gray-200  w-[100vw] mb-4" />

        {/* search box with form */}
        {/* <StockHoldingForm /> */}
        <div className="flex justify-center">
          <PortfolioTable />
        </div>
      </div>
    </>
  );
}
