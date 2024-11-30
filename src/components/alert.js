import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Copy, ArrowRight } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import {
  LINEA_SEPOLIA_ABI,
  LINEA_SEPOLIA_EVENT_CONTRACT,
  INCO_ABI,
  INCO_ADDRESS,
} from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import axios from "axios";
import { storeSignatureData } from "@/firebase/functions";
import { ensureFunding } from "@/utils/fundingHelper";

const TicketPurchaseDialog = ({ event, isOpen, onClose, onPurchase }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [keys, setKeys] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signer, address } = useWalletContext();
  const [wallet, setWallet] = useState(null);
  const [signature, setSignature] = useState(null)

  const readOnLinea = async () => {
    const bprovider = new ethers.JsonRpcProvider("https://rpc.sepolia.linea.build");
    const lineaSepoliaEventContract = new ethers.Contract(
      LINEA_SEPOLIA_EVENT_CONTRACT,
      LINEA_SEPOLIA_ABI,
      bprovider
    );
    const tokenId = await lineaSepoliaEventContract.tokenId();
    console.log('tokenid', tokenId)
    return tokenId;
  };

  function generateWallet() {
    const wallet = ethers.Wallet.createRandom();
    return wallet;
  }

  async function constructSigner(privateKey) {
    // Connect to provider
    const provider = new ethers.JsonRpcProvider('https://rpc.sepolia.linea.build');
    
    // Create wallet from private key and connect to provider
    const signer = new ethers.Wallet(privateKey, provider);
    
    return signer;
}

  // EIP-712 Domain and Types
  const domain = {
    name: "WalletOwnershipProof",
    version: "1",
    chainId: 59141, // Replace with actual chainId
    verifyingContract: "0x0000000000000000000000000000000000000000",
  };

  const types = {
    Proof: [
      { name: "message", type: "string" },
      { name: "nonce", type: "uint256" },
    ],
  };

  const value = {
    message: "I own this wallet",
    nonce: 1,
  };

  async function signMessage(wallet) {
    // storeSignatureData('0x123', '0x123', '0x123');;
    // const signer = await wallet.getSigner();
    const signer = await constructSigner(wallet.privateKey);
    console.log('first')
    // console.log(signer)
    console.log(signer)
    const signature = await signer.signTypedData(domain, types, value);

    const address = await signer.getAddress();
    console.log("Signature:", signature);
    setSignature(signature)
    console.log("Address:", address);

    return { signature, value, address };
  }
  
  const handleKeyGeneration = async () => {
    setIsLoading(true);
    try {
      const w = await generateWallet();
      setWallet(wallet);
      await signMessage(w);
      setKeys({
        publicKey: w.address,
        privateKey: w.privateKey,
      });
      setStep(2);
    } catch (error) {
      console.error("Key generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      return;
    }

    setIsLoading(true);
    try {
      const fundingResult = await ensureFunding(
        address, // address to fund
        "linea", // network
        "0.1", // required balance
        "0.1" // funding amount
      );

      if (!fundingResult.success) {
        console.error("Funding failed:", fundingResult.message);
        return;
      }
      console.log(wallet)
      await onPurchase(event, wallet);
      const uniqueKey = await readOnLinea();
      console.log(uniqueKey);

      const { data } = await axios.post(
        "/api/api/send-email",
        {
          to: email,
          qrUrl: `https://fhe-events.vercel.app/verify/${signature}/${uniqueKey}`,
        }
      );
      console.log(data);
      setStep(3);
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderStep1 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Generate Your Ticket Keys</AlertDialogTitle>
        <AlertDialogDescription>
          First, we&lsquo;ll generate your unique public and private keys for
          this ticket. Please save these carefully - they&lsquo;re required to
          access your ticket.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="my-4 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the button below to generate your unique ticket keys. These keys
          will be used to verify your ticket ownership.
        </p>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Save Your Keys</AlertDialogTitle>
        <AlertDialogDescription>
          Store these keys safely. You&lsquo;ll need them to access your ticket.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="my-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Public Key:</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(keys.publicKey)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <code className="text-xs break-all">{keys.publicKey}</code>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm font-medium">Private Key:</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
              >
                {showPrivateKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              {showPrivateKey && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(keys.privateKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <code className="text-xs break-all">
            {showPrivateKey
              ? keys.privateKey
              : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
          </code>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Purchase Complete!</AlertDialogTitle>
        <AlertDialogDescription>
          Your ticket has been purchased successfully. Check your email for
          confirmation.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="my-4 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thank you for your purchase! We&lsquo;ve sent a confirmation email
          with your ticket details. Remember to keep your keys safe -
          you&lsquo;ll need them to access the event.
        </p>
      </div>
    </>
  );

  const renderFooterButtons = () => {
    switch (step) {
      case 1:
        return (
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleKeyGeneration}
              disabled={isLoading}
              className="ml-3"
            >
              {isLoading ? "Generating..." : "Generate Keys"}
            </Button>
            {/* <Button onClick={readOnInco}>reead</Button> */}
          </>
        );
      case 2:
        return (
          <>
            <AlertDialogCancel>Back</AlertDialogCancel>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !email}
              className="ml-3"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Continue to Purchase
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </>
        );
      case 3:
        return (
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        );
      default:
        return <AlertDialogCancel>Cancel</AlertDialogCancel>;
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <AlertDialogFooter>{renderFooterButtons()}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketPurchaseDialog;
