"use client";

import { darkTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { WagmiProvider } from "wagmi";

import { config } from "@/config/config";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const myTheme = darkTheme({
    accentColor: "transparent",
    accentColorForeground: "#22d3ee",
    borderRadius: "medium",
  });
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={myTheme}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
