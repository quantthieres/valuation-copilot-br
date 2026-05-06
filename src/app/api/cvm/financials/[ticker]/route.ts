import { NextResponse } from "next/server";
import { getCvmCompanyByTicker } from "@/lib/cvm/company-map";
import { getAnnualDfpFinancials } from "@/lib/cvm/dfp-client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> },
) {
  const { ticker } = await params;
  const upper = ticker.toUpperCase();

  const company = getCvmCompanyByTicker(upper);

  if (!company || !company.hasCvmMapping || !company.cvmCode) {
    return NextResponse.json({
      ticker: upper,
      source: "cvm_dfp",
      error: "No verified CVM mapping for this ticker.",
      company: company ?? { ticker: upper, hasCvmMapping: false },
      financials: [],
    });
  }

  try {
    const financials = await getAnnualDfpFinancials(upper, company.cvmCode);

    return NextResponse.json({
      ticker: upper,
      source: "cvm_dfp",
      company: {
        ticker:      upper,
        companyName: company.companyName,
        cvmCode:     company.cvmCode,
        cnpj:        company.cnpj,
      },
      financials,
    });
  } catch {
    return NextResponse.json({
      ticker: upper,
      source: "cvm_dfp",
      error: "Failed to fetch or parse DFP data.",
      company: {
        ticker:      upper,
        companyName: company.companyName,
        cvmCode:     company.cvmCode,
        cnpj:        company.cnpj,
      },
      financials: [],
    });
  }
}
