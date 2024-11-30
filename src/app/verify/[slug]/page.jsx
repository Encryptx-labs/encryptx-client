'use client'
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWallets } from "@privy-io/react-auth";
import { Check, Loader2 } from "lucide-react";
import HeroHeader from "@/components/hero/hero-header";
import { useFhevm } from "@/fhevm/fhevm-context";
import useEIP712Storage from "@/hooks/useEIP712";
import { useWalletContext } from "@/privy/walletContext";
import { INCO_ABI, INCO_ADDRESS } from "@/utils/contracts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QRScanner from "@/components/qrcode";

export default function BlogPost({ params: { slug } }) {
  const { w0, signer, address } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();
  const storage = useEIP712Storage(30, { secureModeEnabled: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log(slug)
    const cod = slug.split("/");
    if (!cod[4] || !cod[5]) {
      console.error("Invalid QR code format");
      return;
    }
  }, [])
  

  useEffect(() => {
    const switchChain = async () => {
      try {
        await w0?.switchChain(21097);
      } catch (error) {
        console.error("Failed to switch chain:", error);
        setError("Failed to switch to the correct network");
      }
    };
    switchChain();
  }, [w0]);

  const verify = async () => {
    try {
      setIsLoading(true);
      setError("");
      const contract = new ethers.Contract(INCO_ADDRESS, INCO_ABI, signer);
      const result = await contract.getEaddressForTicket(slug);
      await reencrypt(result);
      setIsSuccess(true);
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const reencrypt = async (verifyThing) => {
    try {
      let signature, publicKey, privateKey;
      const cachedData = storage.getAddressData(address);

      if (false) {
        ({ signature, publicKey, privateKey } = cachedData.keys);
      } else {
        const keyPair = fhevmInstance.generateKeypair();
        publicKey = keyPair.publicKey;
        privateKey = keyPair.privateKey;

        const eip712 = fhevmInstance.createEIP712(publicKey, INCO_ADDRESS);
        signature = await signer._signTypedData(
          eip712.domain,
          { Reencrypt: eip712.types.Reencrypt },
          eip712.message
        );

        storage.storeUserKeys(
          address,
          { publicKey, privateKey, signature },
          {
            lastFetchTime: Date.now(),
            contractAddress: INCO_ADDRESS,
          }
        );
      }

      const balanceResult = await fhevmInstance.reencrypt(
        verifyThing,
        privateKey,
        publicKey,
        signature.replace("0x", ""),
        INCO_ADDRESS,
        address
      );

      const formattedBobAddress = "0x" + BigInt(balanceResult).toString(16).padStart(40, "0");
      console.log("Formatted Bob's Address:", formattedBobAddress);

      storage.updateAddressData(address, {
        lastFetchTime: Date.now(),
        lastBalance: balanceResult.toString(),
      });
    } catch (err) {
      console.error("Reencryption Error:", err);
      storage.removeUserKeys(address);
      throw err;
    }
  };

  return (
  
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <HeroHeader />
        </div>
        
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify Your Access
                </h2>
                <p className="text-gray-600">
                  Complete verification to access exclusive content
                </p>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription className="text-blue-800">
                  Connected to address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                </AlertDescription>
              </Alert>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-center">
                <Button 
                  onClick={verify}
                  disabled={isLoading || isSuccess}
                  className={`relative px-8 py-3 rounded-lg transition-all duration-200 transform 
                    ${isSuccess ? 'bg-green-600 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} 
                    text-white
                    ${!isLoading && !isSuccess && 'hover:scale-105'}`}
                >
                  <span className={`flex items-center gap-2 ${isLoading || isSuccess ? 'opacity-0' : 'opacity-100'}`}>
                    Start Verification
                  </span>
                  
                  {/* Loading Spinner */}
                  {isLoading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </span>
                  )}
                  
                  {/* Success Checkmark */}
                  {isSuccess && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check className="animate-[scale-in_0.2s_ease-out]" />
                    </span>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-gray-500">
                {isSuccess ? (
                  <span className="text-green-600 font-medium animate-[fade-in_0.5s_ease-out]">
                    User is valid user!!
                  </span>
                ) : (
                  "By verifying, you agree to our terms and conditions"
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}