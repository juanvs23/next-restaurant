import { Product } from "@/database/models/product";

export interface TaxBreakdownItem {
  name: string;
  rate: number;
  amount: number;
}

export interface ChargeEntry {
  name: string;
  type: string;
  value: number;
  amount: number;
}

/**
 * Calculate product-scoped taxes per item.
 * Mutates items in place (adds taxBreakdown and taxRate).
 * Returns the accumulated totalTax from all items.
 *
 * Extracted from POST /api/orders (lines 175–209).
 */
export async function calculateItemTaxes(
  items: any[],
  productTaxes: any[],
  taxCategoryMap: Map<string, string[]>,
  productMap: Map<string, any>,
): Promise<number> {
  let totalTax = 0;

  for (const it of items) {
    const lineTotal = (it.price || 0) * (it.quantity || 1);
    const prod = productMap.get(it.productId?.toString());
    const taxBreakdown: TaxBreakdownItem[] = [];
    let appliedTaxes: any[] = [];

    if (prod) {
      const prodCategoryId = prod.categoryId?.toString();
      const explicitTaxIds = (prod.taxIds || []).map(
        (t: any) => t._id?.toString() || t.toString(),
      );
      if (explicitTaxIds.length > 0) {
        appliedTaxes = productTaxes.filter((tx: any) =>
          explicitTaxIds.includes(tx._id.toString()),
        );
      } else {
        appliedTaxes = productTaxes.filter((tx: any) => {
          const catIds = taxCategoryMap.get(tx._id.toString()) || [];
          return (
            catIds.length > 0 &&
            prodCategoryId &&
            catIds.includes(prodCategoryId)
          );
        });
      }
    } else {
      appliedTaxes = []; // No product lookup → no product-scope taxes
    }

    for (const tx of appliedTaxes) {
      taxBreakdown.push({
        name: tx.name,
        rate: tx.rate,
        amount: lineTotal * tx.rate,
      });
    }

    const itemTax = taxBreakdown.reduce((s, t) => s + t.amount, 0);
    it.taxRate = itemTax > 0 && lineTotal > 0 ? itemTax / lineTotal : 0;
    it.taxBreakdown = taxBreakdown;
    totalTax += itemTax;
  }

  return totalTax;
}

/**
 * Calculate global-scoped taxes on subtotal + optional charges/delivery.
 * Returns the breakdown array and the additional tax amount.
 *
 * Extracted from POST /api/orders (lines 212–220).
 */
export async function calculateGlobalTaxes(
  subtotal: number,
  totalCharge: number,
  deliveryCost: number,
  globalTaxes: any[],
): Promise<{
  globalTaxBreakdown: TaxBreakdownItem[];
  totalTax: number;
}> {
  const globalTaxBreakdown: TaxBreakdownItem[] = [];
  let totalTax = 0;

  for (const gtx of globalTaxes) {
    let taxBase = subtotal;
    if (gtx.applyToServiceCharge) taxBase += totalCharge;
    if (gtx.applyToDelivery) taxBase += deliveryCost;
    const taxAmount = taxBase * gtx.rate;
    globalTaxBreakdown.push({
      name: gtx.name,
      rate: gtx.rate,
      amount: taxAmount,
    });
    totalTax += taxAmount;
  }

  return { globalTaxBreakdown, totalTax };
}

/**
 * Calculate dynamic global charges (percentage / fixed), merge with any
 * override charges from the request body, and return totals.
 *
 * Extracted from POST /api/orders (lines 118–157).
 */
export async function calculateCharges(
  subtotal: number,
  isDelivery: boolean,
  globalCharges: any[],
  config: any,
  orderChargesOverride?: any[],
  deliveryCostFromBody?: number,
): Promise<{
  orderCharges: ChargeEntry[];
  mergedCharges: any[];
  totalCharge: number;
  serviceCharge: number;
  deliveryCost: number;
}> {
  const orderCharges: ChargeEntry[] = [];

  for (const ch of globalCharges) {
    let amount = 0;

    if (ch.appliesToDelivery && !isDelivery) continue;

    if (ch.type === "percentage") {
      const base =
        ch.applyTo?.includes("delivery") && isDelivery
          ? subtotal +
            (deliveryCostFromBody ?? config?.defaultDeliveryCost ?? 0)
          : subtotal;
      amount = Math.round(base * (ch.value / 100) * 100) / 100;
    } else {
      // fixed
      if (ch.applyTo?.includes("delivery") && isDelivery) {
        amount =
          ch.value +
          (deliveryCostFromBody ?? config?.defaultDeliveryCost ?? 0);
      } else {
        amount = ch.value;
      }
    }

    if (amount > 0) {
      orderCharges.push({
        name: ch.name,
        type: ch.type,
        value: ch.value,
        amount,
      });
    }
  }

  // Merge with any override charges from the request body
  const mergedCharges = orderChargesOverride?.length
    ? orderChargesOverride.map((oc: any) => {
        const existing = orderCharges.find((c) => c.name === oc.name);
        return {
          ...(existing || { type: "fixed" }),
          name: oc.name,
          amount: Number(oc.amount),
        };
      })
    : orderCharges;

  const totalCharge = mergedCharges.reduce(
    (s: number, c: any) => s + c.amount,
    0,
  );
  const serviceCharge =
    mergedCharges.find((c: any) => c.type === "percentage")?.amount ?? 0;
  const deliveryCost =
    mergedCharges.find((c: any) => c.applyTo?.includes("delivery"))?.amount ??
    deliveryCostFromBody ??
    config?.defaultDeliveryCost ??
    0;

  return {
    orderCharges,
    mergedCharges,
    totalCharge,
    serviceCharge,
    deliveryCost,
  };
}
