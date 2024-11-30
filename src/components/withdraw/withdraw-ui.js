import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HeroHeader from "../hero/hero-header";
import { useWalletContext } from "@/context/walletContext";
import { Contract } from "ethers";
import { AIAABI, AIACONTRACTADDRESS } from "@/utils/contracts";
import ConnectedAddress from "../connected-address";
import { Loader2, RefreshCw } from "lucide-react";

const WithdrawUI = () => {
  // State management
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [balance, setBalance] = useState(null);
  const { w0, signer, address } = useWalletContext();

  // Constants
  const TOTAL_WITHDRAWALS = 8.2; // Million
  const AVERAGE_WITHDRAWAL = 652;

  // Fetch balance function
  const fetchBalance = async () => {
    if (!address) return;

    setIsBalanceLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/balance/${address}`);
      const data = await response.json();

      if (data.success) {
        setBalance(data.data.balance);
      } else {
        console.error("Error fetching balance:", data.error);
        setError("Failed to fetch balance");
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
    } finally {
      setIsBalanceLoading(false);
    }
  };

  // Fetch balance on mount and when wallet changes
  useEffect(() => {
    if (w0?.address) {
      fetchBalance();
    }
  }, [w0?.address]);

  // Handle withdrawal
  const handleWithdrawal = async () => {
    if (!signer) {
      setError("Please connect your wallet");
      return;
    }

    if (!balance || balance <= 0) {
      setError("No balance available for withdrawal");
      return;
    }

    setIsLoading(true);
    setError("");
    setTransactionHash("");

    try {
      const withdrawContract = new Contract(AIACONTRACTADDRESS, AIAABI, signer);
      const res = await withdrawContract.withdrawFunds(Number(balance));
      const tx = await res.getTransaction();
      console.log(tx)
      await tx.wait();
      setTransactionHash(tx.hash);
      // Refresh balance after successful withdrawal
      // fetchBalance();
    } catch (err) {
      console.error("Withdrawal error:", err);
      setError(
        err.message || "Failed to process withdrawal. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="col-span-6 bg-[#F3F3F3] rounded-full">
        <HeroHeader />
      </div>
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Withdraw Button */}
          <div className="col-span-6 bg-white rounded-[35px] p-8 flex flex-col">
            {/* Title */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-medium">Withdraw</h2>
              <button
                onClick={fetchBalance}
                disabled={isBalanceLoading}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <RefreshCw
                  className={`w-5 h-5 ${
                    isBalanceLoading ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>

            {/* Success Alert */}
            {transactionHash && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Withdrawal successful! Transaction hash:{" "}
                  <span className="font-mono break-all">{transactionHash}</span>
                </AlertDescription>
              </Alert>
            )}

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm text-gray-500">
                    Recipient Address
                  </label>
                  <ConnectedAddress />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Available Balance</span>
                  <span className="font-medium">
                    {isBalanceLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : balance !== null ? (
                      `${balance} USDC`
                    ) : (
                      "Connect wallet to view balance"
                    )}
                  </span>
                </div>
              </div>

              <button
                onClick={handleWithdrawal}
                disabled={isLoading || !balance || balance <= 0}
                className="w-full bg-black text-white font-medium py-4 rounded-2xl hover:bg-black/90 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Withdrawal...
                  </>
                ) : (
                  "Withdraw Now"
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Information */}
          <div className="col-span-6 grid grid-rows-2 gap-8">
            {/* Top Info Card */}
            <div className="bg-white rounded-[35px] p-8 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-52 h-32 grid grid-cols-4 gap-2 p-4">
                  <div className="w-full h-full rounded-lg bg-gray-50/80"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/50"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100 -rotate-3"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/60"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100 rotate-3"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/70"></div>
                </div>
                <div className="absolute bottom-6 right-48 w-8 h-8 rounded-full bg-gray-50/40"></div>
                <div className="absolute bottom-20 right-36 w-6 h-6 rounded-full border-2 border-gray-100"></div>
                <div className="absolute bottom-8 right-28 w-4 h-4 rounded-lg bg-gray-50/60 rotate-45"></div>
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Total Withdrawals
                  </p>
                  <p className="text-3xl font-medium">${TOTAL_WITHDRAWALS}M</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-lg">↓</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-[#00C670]/80 rounded-[35px] p-8 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 right-4 w-52 h-full grid grid-cols-3 gap-3 p-4">
                  <div className="w-full h-16 rounded-lg bg-white/10"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20 rotate-2"></div>
                  <div className="w-full h-16 rounded-lg bg-white/5"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20"></div>
                  <div className="w-full h-16 rounded-lg bg-white/10 -rotate-2"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20"></div>
                  <div className="w-full h-16 rounded-lg bg-white/5"></div>
                  <div className="w-full h-16 rounded-lg border-2 border-white/20 rotate-3"></div>
                  <div className="w-full h-16 rounded-lg bg-white/10"></div>
                </div>
                <div className="absolute top-12 right-60 w-8 h-8 rounded-full border-2 border-white/20"></div>
                <div className="absolute bottom-16 right-56 w-6 h-6 rounded-lg bg-white/10 rotate-45"></div>
                <div className="absolute top-28 right-52 w-4 h-4 rounded-full bg-white/20"></div>
              </div>

              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-12">
                  <span className="text-black text-lg">$</span>
                </div>
                <div>
                  <p className="mb-3 text-white">Average Withdrawal</p>
                  <div className="text-5xl font-medium text-white">
                    ${AVERAGE_WITHDRAWAL}
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

export default WithdrawUI;
