import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  HeartHandshake,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import HeroHeader from "../hero/hero-header";
import { chainsId } from "@/privy/chains";
import { changeWallet } from "@/utils/changeWallet";
import { useWalletContext } from "@/context/walletContext";
import { EncryptionTypes } from "fhenixjs";
import { toHexString } from "@/utils/toHexString";
import axios from "axios";
import { AIAABI, AIACONTRACTADDRESS } from "@/utils/contracts";
import { Contract } from "ethers";

const DistributeUI = () => {
  const [mode, setMode] = useState("multiple");
  const [distributions, setDistributions] = useState([
    {
      id: 1,
      address: "0xfCefe53c7012a075b8a711df391100d9c431c468",
      amount: "300",
    },
    {
      id: 2,
      address: "0xa44366bAA26296c1409AD1e284264212029F02f1",
      amount: "300",
    },
    {
      id: 3,
      address: "0xc1d91b49A1B3D1324E93F86778C44a03f1063f1b",
      amount: "400",
    },
  ]);
  const [lockTime, setLockTime] = useState();
  const [dilute, setDilute] = useState();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { w0, signer, address } = useWalletContext();

  const totalAmount = distributions.reduce((sum, dist) => {
    const amount = parseFloat(dist.amount) || 0;
    return sum + amount;
  }, 0);

  const handleModeToggle = (newMode) => {
    setMode(newMode);
    if (newMode === "single") {
      setDistributions([{ id: 1, address: "", amount: "" }]);
    }
  };

  const handleDistributionChange = (id, field, value) => {
    setDistributions((prevDist) =>
      prevDist.map((dist) =>
        dist.id === id ? { ...dist, [field]: value } : dist
      )
    );
    setError("");
    setIsSuccess(false);
  };

  const handleAddDistribution = () => {
    if (mode === "multiple") {
      const newId = Math.max(...distributions.map((d) => d.id)) + 1;
      setDistributions([
        ...distributions,
        { id: newId, address: "", amount: "" },
      ]);
    }
  };

  const handleRemoveDistribution = (id) => {
    if (distributions.length > 1) {
      setDistributions((prevDist) => prevDist.filter((dist) => dist.id !== id));
    }
  };

  const handleSubmit = async () => {
    const isAddressesValid = distributions.every((dist) =>
      /^0x[a-fA-F0-9]{16,}$/.test(dist.address)
    );
    const isAmountsValid = distributions.every(
      (dist) => !isNaN(dist.amount) && parseFloat(dist.amount) > 0
    );
    if (!isAddressesValid) {
      setError("Please enter valid wallet addresses");
      return;
    }
    if (!isAmountsValid) {
      setError("Please enter valid amounts");
      return;
    }
    if (!lockTime || !dilute) {
      setError("Please set both lock time and dilute time");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const tokenBridgeContract = await new Contract(
        AIACONTRACTADDRESS,
        AIAABI,
        signer
      );

      const addressArray = [
        distributions[0].address,
        distributions[1].address,
        distributions[2].address,
      ];

      console.log(addressArray);

      const res = await tokenBridgeContract.distributeFunds(
        distributions[0].address,
        distributions[1].address,
        distributions[2].address,
        '0x50040000000000007f4403adf656b9824846225f24b9da35033a8fb38c4b8ada8b498c5137b71787ceb6446fc7650e8f0d4705ff2595fc296d1aacb3575ea05d4185f7da1b33344df53f52af572a2c3e0c91280618b5057014d046fe21d7a184814cf259f5f8ef132b9a5e3149cc3bced10b0d957eae33a30dd390724d1178bf5bd08056f06826c5fb91bb7527639a',
        { gasLimit: 7920027 }
      );

      const { data } = await axios.post(
        "/api/distribute-funds",
        {
          user: address,
          userAddress1: distributions[0].address,
          userAddresses2: distributions[1].address,
          userAddresses3: distributions[2].address,
          amount1: distributions[0].amount,
          amount2: distributions[1].amount,
          amount3: distributions[2].amount,
        }
      );

      setIsSuccess(true);
      console.log(data);
    } catch (err) {
      console.log(err)
      setError(err.response?.data?.message || "Failed to process distribution");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <HeroHeader />
      <div className="mx-auto mt-10">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Panel - Distribution Form */}
          <div className="col-span-7 bg-white rounded-[35px] p-8 flex flex-col">
            {/* Title & Toggle */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-medium">Distribute</h2>
              <div className="bg-[#F3F3F3] rounded-full inline-flex">
                <button
                  className={`px-6 py-3 text-sm rounded-full ${
                    mode === "single" ? "bg-black text-white" : "text-gray-400"
                  }`}
                  onClick={() => handleModeToggle("single")}
                  disabled={isLoading}
                >
                  Single
                </button>
                <button
                  className={`px-6 py-3 text-sm rounded-full ${
                    mode === "multiple"
                      ? "bg-black text-white"
                      : "text-gray-400"
                  }`}
                  onClick={() => handleModeToggle("multiple")}
                  disabled={isLoading}
                >
                  Multiple
                </button>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Alert */}
            {isSuccess && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Distribution processed successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Form Content */}
            <div className="flex-1 flex flex-col">
              <div className="space-y-6">
                {distributions.map((dist) => (
                  <div key={dist.id} className="flex gap-4 items-start group">
                    <div className="flex-1">
                      <div className="flex gap-4">
                        <div className="flex-[2]">
                          {dist.id === 1 && (
                            <label className="block text-sm text-gray-500 mb-2">
                              Recipient Address
                            </label>
                          )}
                          <div className="bg-white rounded-2xl p-4 border">
                            <input
                              type="text"
                              value={dist.address}
                              onChange={(e) =>
                                handleDistributionChange(
                                  dist.id,
                                  "address",
                                  e.target.value
                                )
                              }
                              placeholder="0x0C2E8090a89A0af9"
                              className="w-full text-base bg-transparent outline-none"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          {dist.id === 1 && (
                            <label className="block text-sm text-gray-500 mb-2">
                              Amount
                            </label>
                          )}
                          <div className="bg-white rounded-2xl p-4 border">
                            <div className="flex items-center gap-2">
                              <span className="text-base text-gray-400">$</span>
                              <input
                                type="number"
                                value={dist.amount}
                                onChange={(e) =>
                                  handleDistributionChange(
                                    dist.id,
                                    "amount",
                                    e.target.value
                                  )
                                }
                                placeholder="300"
                                className="w-full text-base bg-transparent outline-none"
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {mode === "multiple" && (
                      <button
                        className={`p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all ${
                          dist.id === 1 ? "mt-8" : "mt-4"
                        }`}
                        onClick={() => handleRemoveDistribution(dist.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add More Button */}
                {mode === "multiple" && (
                  <button
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddDistribution}
                    disabled={isLoading}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Recipient</span>
                  </button>
                )}
              </div>

              {/* Time Settings with Shadcn DatePicker */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Lock Time
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-14 rounded-2xl",
                          !lockTime && "text-gray-400"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {lockTime ? (
                          format(lockTime, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={lockTime}
                        onSelect={setLockTime}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-2">
                    Dilute
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-14 rounded-2xl",
                          !dilute && "text-gray-400"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dilute ? (
                          format(dilute, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dilute}
                        onSelect={setDilute}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex justify-between text-sm mb-4">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="font-medium">
                    {totalAmount.toFixed(2)} USDC
                  </span>
                </div>
                <button
                  className={`w-full bg-black text-white font-medium py-4 rounded-2xl transition-colors flex items-center justify-center gap-2
                    ${
                      isLoading
                        ? "opacity-75 cursor-not-allowed"
                        : "hover:bg-black/90"
                    }`}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Distribution...
                    </>
                  ) : (
                    "Submit Distribution"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Information */}
          <div className="col-span-5 grid grid-rows-2 gap-8">
            {/* Top Info Card */}
            <div className="bg-white rounded-[35px] p-8 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-40 h-28 grid grid-cols-3 gap-2 p-4">
                  <div className="w-full h-full rounded-lg bg-gray-50"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/50"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100"></div>
                  <div className="w-full h-full rounded-lg bg-gray-50/80"></div>
                  <div className="w-full h-full rounded-lg border-2 border-gray-100 rotate-3"></div>
                </div>
                <div className="absolute bottom-4 right-36 w-6 h-6 rounded-full border-2 border-gray-100"></div>
                <div className="absolute bottom-16 right-28 w-4 h-4 rounded-full bg-gray-50/60"></div>
              </div>

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    Total Distributed
                  </p>
                  <p className="text-3xl font-medium">$5.2M</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                  <span className="text-white text-lg">↑</span>
                </div>
              </div>
            </div>

            {/* Bottom Info Card */}
            <div className="bg-[#00C670]/70 rounded-[35px] p-8 relative overflow-hidden">
              {/* Bento-style background elements */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Main grid pattern */}
                <div className="absolute top-4 right-4 w-40 h-full grid grid-cols-2 gap-3 p-4">
                  <div className="w-full h-14 rounded-lg bg-white/5"></div>
                  <div className="w-full h-14 rounded-lg border-2 border-white/20"></div>
                  <div className="w-full h-14 rounded-lg border-2 border-white/20 rotate-2"></div>
                  <div className="w-full h-14 rounded-lg bg-white/10"></div>
                  <div className="w-full h-14 rounded-lg bg-white/5"></div>
                  <div className="w-full h-14 rounded-lg border-2 border-white/20 -rotate-2"></div>
                </div>
                {/* Floating elements */}
                <div className="absolute top-10 right-48 w-6 h-6 rounded-full border-2 border-white/20"></div>
                <div className="absolute bottom-10 right-44 w-4 h-4 rounded-full bg-white/10"></div>
              </div>

              <div className="flex flex-col justify-between h-full relative z-10">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mb-12">
                  <span className="text-black text-lg">$</span>
                </div>
                <div>
                  <p className="mb-3 text-white">Average Distribution</p>
                  <div className="text-5xl font-medium text-white">$847</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributeUI;
