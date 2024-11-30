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
import { Eye, EyeOff, Copy, ArrowRight, Wallet, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ethers } from "ethers";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  LINEA_SEPOLIA_ABI,
  LINEA_SEPOLIA_EVENT_CONTRACT,
  INCO_ABI,
  INCO_ADDRESS,
  DUMMYABI,
} from "@/utils/contracts";
import { useWalletContext } from "@/privy/walletContext";
import axios from "axios";
import { storeSignatureData } from "@/firebase/functions";
import { ensureFunding } from "@/utils/fundingHelper";
import { useFhevm } from "@/fhevm/fhevm-context";
import { toHexString } from "@/fhevm/fhe-functions";
import { toast } from "sonner";

const TicketPurchaseDialog = ({ event, isOpen, onClose, onPurchase }) => {
  const [step, setStep] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [email, setEmail] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [keys, setKeys] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signer, address } = useWalletContext();
  const { instance } = useFhevm();
  const [wallet, setWallet] = useState(null);
  const [signature, setSignature] = useState(null);

  // Helper function to read token ID from Linea contract
  const readOnLinea = async () => {
    const bprovider = new ethers.JsonRpcProvider(
      "https://rpc.sepolia.linea.build"
    );
    const lineaSepoliaEventContract = new ethers.Contract(
      LINEA_SEPOLIA_EVENT_CONTRACT,
      LINEA_SEPOLIA_ABI,
      bprovider
    );
    const tokenId = await lineaSepoliaEventContract.tokenId();
    return tokenId;
  };

  // Generate random wallet for anonymous purchase
  function generateWallet() {
    return ethers.Wallet.createRandom();
  }

  // Construct signer from private key
  async function constructSigner(privateKey) {
    const provider = new ethers.JsonRpcProvider(
      "https://rpc.sepolia.linea.build"
    );
    return new ethers.Wallet(privateKey, provider);
  }

  // EIP-712 Domain and Types for signing
  const domain = {
    name: "WalletOwnershipProof",
    version: "1",
    chainId: 59141,
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

  // Sign message with wallet
  async function signMessage(wallet) {
    const signer = await constructSigner(wallet.privateKey);
    const signature = await signer.signTypedData(domain, types, value);
    const address = await signer.getAddress();
    setSignature(signature);
    return { signature, value, address };
  }

  const handleBuyTicket = async (event) => {
    try {
      const input = await instance.createEncryptedInput(INCO_ADDRESS, address);
      input.addAddress(address);
      const encryptedInput = input.encrypt();
      console.log(encryptedInput);

      // Convert input proof to hex string with '0x' prefix
      const inputProof = "0x" + toHexString(encryptedInput.inputProof);
      console.log(encryptedInput.handles[0], encryptedInput.inputProof);

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

      // Create contract instance
      const eventContract = new ethers.Contract(
        LINEA_SEPOLIA_EVENT_CONTRACT,
        DUMMYABI,
        signer // Make sure you have a valid signer instance
      );

      // Prepare transaction parameters
      const txParams = {
        value: ethers.parseUnits("10", "wei"),
        gasLimit: 1000000, // Using BigInt for gas limit
      };

      // Call purchaseToken function
      const transaction = await eventContract.purchaseToken(
        encryptedInput.handles[0],
        inputProof,
        1,
        txParams
      );

      // Wait for transaction confirmation
      const receipt = await transaction.getTransaction();
      await receipt.wait();

      console.log("Transaction successful:", receipt);
      toast.success("Transfer successful!", {
        description: `Transaction hash: ${receipt.hash.slice(
          0,
          6
        )}...${receipt.hash.slice(-4)}`,
      });

      // Show toast promise for purchase processing
      toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
        loading: "Processing your purchase...",
        success: `Ticket purchased for ${event.title}!`,
        error: "Failed to purchase ticket",
      });

      return receipt;
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Purchase failed", {
        description: error.message || "Unknown error occurred",
      });
      throw error;
    }
  };

  // Handle checkout type selection
  const handleCheckoutTypeSelection = (anonymous) => {
    setIsAnonymous(anonymous);
    setStep(anonymous ? 1 : 2);
  };

  // Handle key generation for anonymous purchase
  const handleKeyGenerationforAnonymous = async () => {
    setIsLoading(true);
    try {
      const w = await generateWallet();
      setWallet(w);
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

  const signSignatureNonAnonUser = async () => {
    const signature = await signer._signTypedData(domain, types, value);
    const address = await signer.getAddress();
    setSignature(signature);
    console.log(signature);
    return { signature, value, address };
  };

  // Handle final purchase submission
  const purchaseToken = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      let sign = signature;
      if (!isAnonymous) {
        const s = await signSignatureNonAnonUser();
        sign = s.signature;
      }
      const fundingResult = await ensureFunding(address, "linea", "0.1", "0.1");

      if (!fundingResult.success) {
        console.error("Funding failed:", fundingResult.message);
        return;
      }

      isAnonymous ? await onPurchase(event, wallet) : handleBuyTicket(event);
      const uniqueKey = await readOnLinea();

      console.log("sign", sign);

      const { data } = await axios.post("/api/api/send-email", {
        to: email,
        qrUrl: `https://fhe-events.vercel.app/verify/${sign}/${uniqueKey}`,
      });

      setStep(3);
    } catch (error) {
      console.error("Purchase error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle copying to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Render checkout type selection
  const renderCheckoutTypeSelection = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Choose Ticket Type</AlertDialogTitle>
        <AlertDialogDescription>
          Select how you would like to purchase your ticket for {event.name}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="grid grid-cols-1 gap-4 my-4">
        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={() => handleCheckoutTypeSelection(true)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg">Anonymous Ticket</CardTitle>
              <CardDescription>
                Purchase ticket with generated keys for complete privacy
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        <Card
          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onClick={() => handleCheckoutTypeSelection(false)}
        >
          <CardHeader className="flex flex-row items-center gap-4">
            <Wallet className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg">Standard Ticket</CardTitle>
              <CardDescription>
                Purchase ticket with your connected wallet
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Ticket Price: {event.price} USDC
        </p>
      </div>
    </>
  );

  // Render key generation step
  const renderStep1 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Generate Your Ticket Keys</AlertDialogTitle>
        <AlertDialogDescription>
          First, we&apos;ll generate your unique public and private keys for this
          ticket. Please save these carefully - they&apos;re required to access your
          ticket.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="my-4 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the button below to generate your unique ticket keys. These keys
          will be used to verify your ticket ownership at {event.name}.
        </p>
      </div>
    </>
  );

  // Render email and key display step
  const renderStep2 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {isAnonymous ? "Save Your Keys" : "Enter Your Email"}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {isAnonymous
            ? "Store these keys safely. You'll need them to access your ticket."
            : "Enter your email to receive ticket confirmation"}
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

        {isAnonymous && keys && (
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
        )}
      </div>
    </>
  );

  // Render success step
  const renderStep3 = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Purchase Complete!</AlertDialogTitle>
        <AlertDialogDescription>
          Your ticket for {event.name} has been purchased successfully.
        </AlertDialogDescription>
      </AlertDialogHeader>

      <div className="my-4 space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Thank you for your purchase! We&apos;ve sent a confirmation email with your
          ticket details to {email}.
          {isAnonymous &&
            " Remember to keep your keys safe - you'll need them to access the event."}
        </p>
      </div>
    </>
  );

  // Render footer buttons based on current step
  const renderFooterButtons = () => {
    switch (step) {
      case 0:
        return <AlertDialogCancel>Cancel</AlertDialogCancel>;
      case 1:
        return (
          <>
            <AlertDialogCancel onClick={() => setStep(0)}>
              Back
            </AlertDialogCancel>
            <Button
              onClick={handleKeyGenerationforAnonymous}
              disabled={isLoading}
              className="ml-3"
            >
              {isLoading ? "Generating..." : "Generate Keys"}
            </Button>
          </>
        );
      case 2:
        return (
          <>
            <AlertDialogCancel onClick={() => setStep(isAnonymous ? 1 : 0)}>
              Back
            </AlertDialogCancel>
            <Button
              onClick={purchaseToken}
              disabled={isLoading || !email}
              className="ml-3"
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  Complete Purchase
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
        {step === 0 && renderCheckoutTypeSelection()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        <AlertDialogFooter>{renderFooterButtons()}</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TicketPurchaseDialog;
