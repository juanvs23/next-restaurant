export function formatVes(amount: number): string {
  return `Bs ${amount.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function fmtPrice(ves: number, bcv: number): string {
  const usd = bcv > 0 ? ves / bcv : 0;
  const usdStr = usd > 0 ? ` ≈ ${formatUsd(usd)}` : "";
  return `${formatVes(ves)}${usdStr}`;
}

export function fmtPriceFull(ves: number, bcv: number, usdt: number): string {
  const parts = [formatVes(ves)];
  if (bcv > 0) parts.push(`≈ ${formatUsd(ves / bcv)} USD-BCV`);
  if (usdt > 0) parts.push(`≈ ${formatUsd(ves / usdt)} USDT`);
  return parts.join(" · ");
}

export function usdToVes(usd: number, rate: number): number {
  return Math.round(usd * rate * 100) / 100;
}
