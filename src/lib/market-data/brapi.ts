import type { MarketDataQuote } from "./types";

interface BrapiResult {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  marketCap?: number;
  regularMarketTime?: string;
}

interface BrapiResponse {
  results?: BrapiResult[];
  error?: string;
}

export async function getBrapiQuote(ticker: string): Promise<MarketDataQuote | null> {
  try {
    const token = process.env.BRAPI_TOKEN;

    const url = new URL(`https://brapi.dev/api/quote/${encodeURIComponent(ticker)}`);
    if (token) {
      url.searchParams.set("token", token);
    }

    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: BrapiResponse = await res.json();
    const result = data.results?.[0];
    if (!result || typeof result.regularMarketPrice !== "number") return null;

    return {
      ticker:        result.symbol,
      price:         result.regularMarketPrice,
      change:        result.regularMarketChange,
      changePercent: result.regularMarketChangePercent,
      marketCap:     result.marketCap,
      updatedAt:     result.regularMarketTime,
      source:        "brapi",
    };
  } catch {
    return null;
  }
}
