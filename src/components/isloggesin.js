"use client";
import React from "react";
import { EventsProvider } from "@/context/event-context";
// import Navbar from "@/components/nav";
// import { useWalletContext } from "@/privy/walletContext";
import { FhevmProvider } from "@/fhevm/fhevm-context";
import { useWalletContext } from "@/privy/walletContext";

const IsLoggedIn = ({ children }) => {
  const { address } = useWalletContext();
  return (
    <EventsProvider address={address}>
      <FhevmProvider>
      {/* <Navbar /> */}
      {children}</FhevmProvider>
    </EventsProvider>
  );
};

export default IsLoggedIn;
