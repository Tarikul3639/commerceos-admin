"use client"

import { Toaster } from "@/components/ui/sonner"

import { Provider } from "react-redux"
import { store } from "./index"

type StoreProviderProps = {
  children: React.ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  return (
    <Provider store={store}>
      {children}
      <Toaster richColors position="top-right" />
    </Provider>
  )
}
