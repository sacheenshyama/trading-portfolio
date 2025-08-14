export interface AuthState {
  jwtToken: string | null;
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

export interface StockSearch {
  dispSecIndFlag: boolean;
  exchDisp: string;
  exchange: string;
  index: string;
  industry: string;
  industryDisp: string;
  isYahooFinance: boolean;
  longname: string;
  nameChangeDate: string;
  prevName: string;
  quoteType: string;
  score: number;
  sector: string;
  sectorDisp: string;
  shortname: string;
  symbol: string;
  typeDisp: string;
}

export interface SelectedStock {
  exchDisp: string;
  exchange: string;
  index: string;
  isYahooFinance: boolean;
  quoteType: string;
  score: number;
  shortname: string;
  symbol: string;
  typeDisp: string;
}

export interface ActivityLog {
  stockId: string;
  owner: string;
  symbol: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  action: "CREATED" | "UPDATED" | "DELETED";
  message: string;
  _id: string;
  createdAt: string;
}

export interface SimpleLoginIn {
  email: string;
  password: string;
}

export interface OtpSignin {
  givenEmail: string;
  otpValue: string;
}
