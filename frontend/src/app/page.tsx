import PortfolioTable from "@/components/PortfolioTable";
import SectorSummary from "@/components/SectorSummary";
import Image from "next/image";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto p-4">
      <h1 className="text-wxl font-bold mb-4">Portfolio Dashboard</h1>
      <SectorSummary />
      <div className="mt-6">
        <PortfolioTable />
      </div>
    </main>
  );
}
