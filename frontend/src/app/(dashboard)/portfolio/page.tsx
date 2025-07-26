import PortfolioTable from "@/components/PortfolioTable";
import SectorSummary from "@/app/(dashboard)/portfolio/_components/SectorSummary";
import StockHoldingForm from "./_components/StockHoldingForm";

export default function Page() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-wxl font-bold mb-4">Portfolio Dashboard</h1>
      {/* search box with form */}
      <StockHoldingForm />

      <div className="mt-6">
        <PortfolioTable />
      </div>
    </main>
  );
}
