"use client";
import { EventsBentoGrid } from "@/components/events-grid";
import HeroHeader from "@/components/hero/hero-header";
import { useWalletContext } from "@/privy/walletContext";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { address, w0 } = useWalletContext();
  const [error, setError] = useState(null)
  useEffect(() => {
    const switchChain = async () => {
      try {
        await w0?.switchChain(59141);
      } catch (error) {
        console.error("Failed to switch chain:", error);
        setError("Failed to switch to the correct network");
      }
    };
    switchChain();
  }, [w0]);
  return (
    <div className="min-h-screen p-8 bg-[#F3F3F3]">
      <div className="mb-20">
        <HeroHeader />
      </div>
      <EventsBentoGrid userAddress={address} />
    </div>
  );
};

export default Page;
