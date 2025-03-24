"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";

function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <div className="w-fit h-fit border-[1px] border-cyan-400 rounded-xl p-1.5">
      <ConnectButton
        showBalance={false}
        chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
        accountStatus={"full"}
      />
    </div>
  ) : (
    <Skeleton className="w-[150px] h-[50px] rounded-full bg-gray-200" />
  );
}

export default WalletButton;
