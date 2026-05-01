export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}

export function formatMultiple(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace(".", ",")}x`;
}

export function formatNumberBR(value: number, decimals = 2): string {
  return value.toFixed(decimals).replace(".", ",");
}
