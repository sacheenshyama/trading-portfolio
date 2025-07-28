import PortfolioTable from "@/app/(dashboard)/portfolio/_components/PortfolioTable";
import StockHoldingForm from "./_components/StockHoldingForm";
import Navbar from "@/app/_components/Navbar";

export default function Page() {
  return (
    <>
      <div>
        <Navbar />
        <hr className="text-gray-200  w-[100vw] mb-4" />

        <h2 className="px-2 text-2xl font-bold mt-5 mb-2">My Portfolio</h2>
        {/* search box with form */}
        <StockHoldingForm />
        <div className="mt-6">
          <PortfolioTable />
        </div>
      </div>
    </>
  );
}
