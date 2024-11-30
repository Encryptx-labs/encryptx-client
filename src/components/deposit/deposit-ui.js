import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import HeroHeader from "../hero/hero-header";
import { useWalletContext } from "@/context/walletContext";
import { changeWallet } from "@/utils/changeWallet";
import { chainsId } from "@/privy/chains";
import {
  AIAABI,
  AIACONTRACTADDRESS,
  USDCABI,
  USDCADDRESS,
} from "@/utils/contracts";
import { Contract, ethers } from "ethers";
import { Button } from "../ui/button";
import { RefreshCw } from "lucide-react";
import ConnectedAddress from "../connected-address";

const DepositUI = () => {
  // State management
  const [mode, setMode] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  // Loading states
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isMintLoading, setIsMintLoading] = useState(false);

  // Error states
  const [balanceError, setBalanceError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const { w0, signer, address } = useWalletContext();

  useEffect(() => {
    if (!w0) return;
    const initializeWallet = async () => {
      try {
        await getBalance();
      } catch (error) {
        setBalanceError("Failed to initialize wallet");
        console.error("Wallet initialization error:", error);
      }
    };
    initializeWallet();
  }, [w0]);

  const getBalance = async () => {
    if (!signer || !address) return;

    setIsBalanceLoading(true);
    setBalanceError("");

    try {
      const usdcContract = new Contract(USDCADDRESS, USDCABI, signer);
      const balanceWei = await usdcContract.balanceOf(address);
      console.log(balanceWei);
      const balanceFormatted = parseFloat(ethers.formatUnits(balanceWei, 18));
      setBalance(balanceFormatted);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setBalanceError("Failed to fetch balance");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    setIsDepositLoading(true);
    setTransactionError("");

    try {
      const value = ethers.parseUnits(amount, "ether");
      const tokenBridge = new Contract(AIACONTRACTADDRESS, AIAABI, signer);

      const res = await tokenBridge.lockTokens(value, { gasLimit: 7920027 });
      const tx = await res.getTransaction();
      await tx.wait();

      await getBalance();
      setAmount("");
    } catch (error) {
      console.error("Deposit failed:", error);
      setTransactionError("Deposit failed. Please try again.");
    } finally {
      setIsDepositLoading(false);
    }
  };

  const handlePayBtn = async () => {
    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    setIsMintLoading(true);
    setTransactionError("");

    try {
      const usdcContract = new Contract(USDCADDRESS, USDCABI, signer);

      const response = await usdcContract.transferFromOwner(
        AIACONTRACTADDRESS,
        { gasLimit: 1000000 }
      );
      const tx = await response.getTransaction();
      await tx.wait();

      await getBalance();
      setAmount("");
    } catch (error) {
      console.error("Mint failed:", error);
      setTransactionError("Mint failed. Please try again.");
    } finally {
      setIsMintLoading(false);
    }
  };

  const handleAmountChange = (value) => {
    const cleanedValue = value.replace(/[^0-9.]/g, "");
    if ((cleanedValue.match(/\./g) || []).length > 1) return;

    if (cleanedValue.includes(".")) {
      const [whole, decimal] = cleanedValue.split(".");
      if (decimal?.length > 2) return;
    }

    setAmount(cleanedValue);
    setError("");
  };

  const handleMaxClick = () => {
    setAmount(balance.toString());
    setError("");
  };

  const handlePreviewDeposit = () => {
    if (mode === "mint") {
      handlePayBtn();
    } else {
      handleDeposit();
    }
  };

  // Constants
  const TOTAL_DEPOSITS = 12.4; // Million
  const CURRENT_APY = 4.87;

  return (
    <div>
      <div className="col-span-6 bg-[#F3F3F3] rounded-full">
        <HeroHeader />
      </div>
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Deposit Form */}
          <div className="col-span-6 bg-white rounded-[35px] p-8 flex flex-col">
            {/* Title & Toggle */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-medium">Deposit</h2>
              <div className="bg-[#F3F3F3] rounded-full p-1 inline-flex">
                <button
                  className={cn(
                    "px-5 py-2 rounded-full text-sm transition-all",
                    mode === "mint" ? "bg-black text-white" : "text-gray-400"
                  )}
                  onClick={() => setMode("mint")}
                >
                  Mint
                </button>
                <button
                  className={cn(
                    "px-5 py-2 rounded-full text-sm transition-all",
                    mode === "deposit" ? "bg-black text-white" : "text-gray-400"
                  )}
                  onClick={() => setMode("deposit")}
                >
                  Deposit
                </button>
              </div>
            </div>

            {/* Error Alerts */}
            {(error || transactionError || balanceError) && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {error || transactionError || balanceError}
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Amount
                  </label>
                  <div className="bg-white rounded-2xl p-4 border">
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-gray-400">$</span>
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full text-xl bg-transparent outline-none"
                        disabled={isDepositLoading || isMintLoading}
                      />
                      <button
                        onClick={handleMaxClick}
                        className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={isDepositLoading || isMintLoading}
                      >
                        MAX
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  Connected Address: <ConnectedAddress />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Available Balance</span>
                  <div className="flex items-center gap-2">
                    {isBalanceLoading ? (
                      <span className="animate-pulse">Loading...</span>
                    ) : (
                      <span className="font-medium">
                        $ {balance.toLocaleString()}
                      </span>
                    )}
                    <button
                      onClick={getBalance}
                      disabled={isBalanceLoading}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <RefreshCw
                        className={cn(
                          "w-4 h-4",
                          isBalanceLoading && "animate-spin"
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePreviewDeposit}
                disabled={isDepositLoading || isMintLoading}
                className={cn(
                  "w-full bg-black text-white font-medium py-4 rounded-2xl hover:bg-black/90 transition-colors mt-8",
                  (isDepositLoading || isMintLoading) &&
                    "opacity-50 cursor-not-allowed"
                )}
              >
                {isDepositLoading || isMintLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {mode === "deposit" ? "Depositing..." : "Minting..."}
                  </span>
                ) : mode === "deposit" ? (
                  "Preview Deposit"
                ) : (
                  "Mint"
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Information */}
          <div className="col-span-6 grid grid-rows-2 gap-8">
            {/* Top Info Card */}
            <div className="bg-white rounded-[35px] p-8 relative overflow-hidden">
              {/* Bento-style background elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main grid pattern */}
                <div className="absolute bottom-0 right-0 w-48 h-32 grid grid-cols-3 gap-2 p-4">
                  <div className="w-full h-full rounded-lg bg-gray-50"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/50"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/80"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                </div>
                {/* Decorative circles */}
                <div className="absolute bottom-6 right-40 w-8 h-8 rounded-full border-2 border-gray-100"></div>
                <div className="absolute bottom-20 right-28 w-6 h-6 rounded-full bg-gray-50/60"></div>
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Total Deposits</p>
                  <p className="text-3xl font-medium">${TOTAL_DEPOSITS}M</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-lg">↑</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-[#00C670]/80 rounded-[35px] p-8 relative overflow-hidden">
              {/* Bento-style background elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main grid pattern */}
                <div className="absolute top-4 right-4 w-48 h-full grid grid-cols-2 gap-3 p-4">
                  <div className="w-full h-16 rounded-lg bg-white/5"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20"></div>
                  <div className="w-full h-16 rounded-lg bg-white/10"></div>
                  <div className="w-full h-16 rounded-lg bg-white/5"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20"></div>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-12 right-56 w-8 h-8 rounded-full border-2 border-white/20"></div>
                <div className="absolute bottom-12 right-52 w-6 h-6 rounded-full bg-white/10"></div>
              </div>

              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center mb-12">
                  <span className="text-white text-lg">$</span>
                </div>
                <div>
                  <p className="mb-3 text-white">Current APY</p>
                  <div className="text-5xl font-medium text-white">
                    {CURRENT_APY}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositUI;
