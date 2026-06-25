"use client";
import { createContext, useContext, type ReactNode } from "react";

export interface BillingContextType {
  todayClosed: boolean;
  todayLocal: string;
  isTodayOrder: (bill: any) => boolean;
  confirmPayment: (bill: any) => Promise<void>;
  openEdit: (bill: any) => void;
  revertBill: (bill: any) => Promise<void>;
  cancelBill: (bill: any) => Promise<void>;
  openCreditNote: (order: any) => void;
}

const BillingContext = createContext<BillingContextType | null>(null);

export function useBilling() {
  const ctx = useContext(BillingContext);
  if (!ctx) throw new Error("useBilling must be used within BillingProvider");
  return ctx;
}

export function BillingProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: BillingContextType;
}) {
  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
}
