export interface MarketDataQuote {
  ticker: string;
  price: number;
  change?: number;
  changePercent?: number;
  marketCap?: number;
  updatedAt?: string;
  source: "brapi" | "mock";
}
