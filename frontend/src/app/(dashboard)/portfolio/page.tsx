import PortfolioTable from "@/app/(dashboard)/portfolio/_components/PortfolioTable";
import StockHoldingForm from "./_components/StockHoldingForm";

export default function Page() {
  return (
    <>
      <h1 className="text-wxl font-bold mb-4">Portfolio Dashboard</h1>
      {/* search box with form */}
      <StockHoldingForm />

      <div className="mt-6">
        <PortfolioTable />
      </div>
    </>
  );
}
