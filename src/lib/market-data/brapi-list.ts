export interface BrapiAvailableAsset {
  stock: string;
  name: string;
  close: number | null;
  change: number | null;
  volume: number | null;
  market_cap: number | null;
  logo: string | null;
  sector: string | null;
}

export async function getBrapiAvailableAssets(): Promise<BrapiAvailableAsset[]> {
  try {
    const token = process.env.BRAPI_TOKEN;
    const url = token
      ? `https://brapi.dev/api/quote/list?token=${encodeURIComponent(token)}`
      : `https://brapi.dev/api/quote/list`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const body = (await res.json()) as { stocks?: BrapiAvailableAsset[] };
    return body.stocks ?? [];
  } catch {
    return [];
  }
}
