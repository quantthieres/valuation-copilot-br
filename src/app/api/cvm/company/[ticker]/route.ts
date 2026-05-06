import { NextResponse } from "next/server";
import { getCvmCompany } from "@/lib/cvm/cvm-client";
import { lookupCvmCompany } from "@/lib/cvm/cvm-registry";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();

  const staticEntry = getCvmCompany(upper);

  // Attempt dynamic name-based match against live CVM registry.
  const dynamicMatch = await lookupCvmCompany(upper);

  if (dynamicMatch) {
    return NextResponse.json({
      company:     dynamicMatch.company,
      source:      "cvm_registry",
      matchMethod: dynamicMatch.matchMethod,
    });
  }

  if (staticEntry) {
    return NextResponse.json({
      company:     staticEntry,
      source:      "static_map",
      matchMethod: staticEntry.hasCvmMapping ? "manual_verification" : null,
    });
  }

  return NextResponse.json({
    company:     { ticker: upper, hasCvmMapping: false },
    source:      "static_map",
    matchMethod: null,
  });
}
