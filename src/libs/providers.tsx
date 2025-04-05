'use client'
import { SessionProvider } from "next-auth/react"
import StoreProvider from "./store/storeProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <StoreProvider><SessionProvider>{children}</SessionProvider></StoreProvider>;
}