"use client"

import { PropsWithChildren } from "react"
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

export const AppQueryClientProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
