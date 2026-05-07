import ReportPageClient from "./ReportPageClient";

interface Props {
  params:      Promise<{ ticker: string }>;
  searchParams: Promise<{ source?: string }>;
}

export default async function ReportPage({ params, searchParams }: Props) {
  const { ticker } = await params;
  const sp         = await searchParams;
  const source     = sp.source ?? "mock";

  return <ReportPageClient ticker={ticker.toUpperCase()} source={source} />;
}
