"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { createStorage } from "wagmi";
import { berachainBepolia, berachainTestnet } from "wagmi/chains";

const storage = createStorage({
  storage: typeof window !== "undefined" ? window.localStorage : undefined,
});

export const config = getDefaultConfig({
  appName: "Cubhub",
  projectId: "6b160afd8d190502aae8559c94e7d799",
  chains: [berachainBepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [berachainBepolia.id]: http(),
  },
  storage,
  // Increase connection timeout
  pollingInterval: 8000,
});
