export interface AuthState {
  jwtToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface PortfolioStock extends PortfolioStockInput {
  id: string;
  invested: number;
  portfolioPercentage: number;
  cmp: number;
  presentValue: number | string;
  peRatio: number;
  gainLoss: number | string;
  gainLossPercent: number | string;
  latestEarningsTimestamp?: number | string | null;
}
export interface portfolioSummary {
  totalInvested: string | number;
  totalCurrentValue: string | number;
  totalGainLoss: number;
  totalGainLossPercent: string | number;
  stocksCount: number;
}
export interface PortfolioResponse {
  summary: portfolioSummary;
  portfolio: PortfolioStock[];
}
export interface updateStockType {
  stockupdate: PortfolioStock;
  stockInput: PortfolioStockInput;
}
export interface PortfolioStockInput {
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  exchange: string;
  id?: string;
}

export type DeleteStockRequest = {
  id: string;
};

export interface StockChartPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
export interface StockMeta {
  meta: StockMeta | null;
  chartData: StockChartPoint[];

}
