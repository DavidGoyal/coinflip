"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { createStorage, http } from "wagmi";

const storage = createStorage({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

const hyperliquid = defineChain({
  id: 998,
  name: "HyperEVM Testnet",
  iconBackground: "#fff",
  nativeCurrency: { name: "Hype", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
  },
});

export const config = getDefaultConfig({
  appName: "Coinflip",
  projectId: "6b160afd8d190502aae8559c94e7d799",
  chains: [hyperliquid],
  transports: {
    [hyperliquid.id]: http("https://rpc.hyperliquid-testnet.xyz/evm"),
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
  storage,
  // Increase connection timeout
  pollingInterval: 8000,
});
