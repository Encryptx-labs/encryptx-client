import { useWalletContext } from "@/context/walletContext";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

const ConnectedAddress = () => {
  const { address } = useWalletContext();
  const [copied, setCopied] = useState(false);

  if (!address) {
    return null;
  }

  const truncatedAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
      <div className="text-black">{truncatedAddress}</div>
      <button
        onClick={handleCopy}
        className="p-1 hover:bg-gray-200 rounded-md transition-colors"
        title={copied ? "Copied!" : "Copy address"}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-gray-600" />
        )}
      </button>
    </div>
  );
};

export default ConnectedAddress;