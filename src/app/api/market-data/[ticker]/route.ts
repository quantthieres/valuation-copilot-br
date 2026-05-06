import { NextResponse } from "next/server";
import { getBrapiQuote } from "@/lib/market-data/brapi";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> },
) {
  try {
    const { ticker } = await params;

    if (!ticker || typeof ticker !== "string") {
      return NextResponse.json({ quote: null });
    }

    const quote = await getBrapiQuote(ticker.toUpperCase());
    return NextResponse.json({ quote });
  } catch {
    return NextResponse.json({ quote: null });
  }
}
