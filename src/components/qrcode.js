"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { Button } from "./ui/button";
import { Check, Loader2 } from "lucide-react";
import { useWalletContext } from "@/privy/walletContext";
import { useFhevm } from "@/fhevm/fhevm-context";
import {
  LINEA_SEPOLIA_ABI,
  LINEA_SEPOLIA_EVENT_CONTRACT,
  INCO_ABI,
  INCO_ADDRESS,
} from "@/utils/contracts";

const QRScanner = () => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const [retrivedAddress, setRetrivedAddress] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRecoveringAddress, setIsRecoveringAddress] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const { address, signer, w0 } = useWalletContext();
  const { instance: fhevmInstance } = useFhevm();
  const [tokenId, setTokenId] = useState(1);

  console.log(tokenId)

  console.log(address)

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

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (scannerRef.current) await scannerRef.current.stop();
  
        scannerRef.current = new Html5Qrcode("qr-reader");
        setIsScanning(true);
  
        const config = {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          aspectRatio: 1.0,
          formatsToSupport: ["QR_CODE"],
        };
  
        // Try to get back camera first
        try {
          await scannerRef.current.start(
            { facingMode: "environment" }, // This specifies back camera
            config,
            async (decodedText) => {
              try {
                const cod = decodedText.split("/");
                if (!cod[4] || !cod[5]) {
                  console.error("Invalid QR code format");
                  return;
                }
                
                setLastScanned(cod[4]);
                setTokenId(cod[5]);
                setIsRecoveringAddress(true);
                
                try {
                  const address = await verifySignature(cod[4]);
                  setRetrivedAddress(address);
                } catch (error) {
                  console.error("Verification failed:", error);
                  setRetrivedAddress("Invalid signature");
                } finally {
                  setIsRecoveringAddress(false);
                }
              } catch (error) {
                console.error("QR processing error:", error);
                setIsRecoveringAddress(false);
              }
            },
            (error) => {
              if (!error.toString().includes("NotFoundException")) {
                // console.error("QR Error:", error);
              }
            }
          );
        } catch (backCameraError) {
          console.log("Back camera not available, trying front camera");
          // If back camera fails, try front camera
          await scannerRef.current.start(
            { facingMode: "user" },
            config,
            async (decodedText) => {
              const cod = decodedText.split("/");
              setLastScanned(cod[4]);
              setTokenId(cod[5]);
              setIsRecoveringAddress(true);
              await new Promise((resolve) => setTimeout(resolve, 1500));
              const address = await verifySignature(cod[4]);
              setRetrivedAddress(address);
              setIsRecoveringAddress(false);
            },
            (error) => {
              if (!error.toString().includes("NotFoundException")) {
                // console.error("QR Error:", error);
              }
            }
          );
        }
      } catch (err) {
        console.error("Scanner Error:", err);
        setIsScanning(false);
      }
    };
  
    initializeScanner();
    return () => {
      if (scannerRef.current) scannerRef.current.stop().catch(console.error);
    };
  }, []);

  const readOnInco = async () => {
    const provider = new ethers.JsonRpcProvider(
      "https://validator.rivest.inco.org"
    );
    const contract = new ethers.Contract(INCO_ADDRESS, INCO_ABI, provider);
    const result = await contract.getDeterministicKey(
      59141,
      LINEA_SEPOLIA_EVENT_CONTRACT,
      tokenId
    );
    console.log(result);
    console.log("tokenid", tokenId);
    return result;
  };

  async function verifySignature(data) {
    try {
      const signature = data;
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
  
      const digest = ethers.TypedDataEncoder.hash(domain, types, value);
      
      // Add validation for signature length
      if (!signature || signature.length !== 132) {
        throw new Error("Invalid signature length");
      }
  
      // Split signature into components
      const r = signature.slice(0, 66);
      const s = "0x" + signature.slice(66, 130);
      const v = parseInt(signature.slice(130, 132), 16);
  
      // Validate recovery parameter
      if (v !== 27 && v !== 28) {
        throw new Error("Invalid recovery parameter");
      }
  
      // Use proper signature format for recoverAddress
      const formattedSignature = r + s.slice(2) + v.toString(16).padStart(2, '0');
      
      try {
        const recoveredAddress = ethers.recoverAddress(digest, formattedSignature);
        return recoveredAddress;
      } catch (error) {
        console.error("Address recovery error:", error);
        throw new Error("Failed to recover address from signature");
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      return "0x0000000000000000000000000000000000000000"; // Return zero address on error
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const verifyAddress = async () => {
    try {
      setIsVerifying(true);
      setVerificationSuccess(false);
      
      const incoPRovider = new ethers.JsonRpcProvider('https://validator.rivest.inco.org');
      const keyPair = fhevmInstance.generateKeypair();
      const publicKey = keyPair.publicKey;
      const privateKey = keyPair.privateKey;

      const eip712 = fhevmInstance.createEIP712(publicKey, INCO_ADDRESS);
      const signature = await signer._signTypedData(
        eip712.domain,
        { Reencrypt: eip712.types.Reencrypt },
        eip712.message
      );

      const incoContract = new ethers.Contract(INCO_ADDRESS, INCO_ABI, incoPRovider);
      const hash = await readOnInco();

      const encryptedAddress = await incoContract.tokenKeyToEaddress(hash);
      // const decryptedAddress = await fhevmInstance.reencrypt(
      //   encryptedAddress,
      //   privateKey,
      //   publicKey,
      //   signature.replace("0x", ""),
      //   INCO_ADDRESS,
      //   address
      // );
      
      // const formattedHolderAddress = "0x" + BigInt(decryptedAddress).toString(16).padStart(40, "0");
      // console.log("Formatted Bob's Address:", formattedHolderAddress);
      
      setVerificationSuccess(true);
      // Reset success state after 3 seconds
      setTimeout(() => {
        setVerificationSuccess(false);
        setIsVerifying(false);
      }, 6000);
    } catch (error) {
      console.error("Verification failed:", error);
      setIsVerifying(false);
      setVerificationSuccess(false);
    }
  };
  return (
    <>
      <div className="min-h-screen bg-gray-50 relative flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 p-4 w-full max-w-md shadow-sm relative">
          <h1 className="text-xl font-bold text-gray-900 mb-4 text-center">
            QR Scanner
          </h1>

          <div className="relative mb-4">
            <div
              id="qr-reader"
              className="overflow-hidden rounded-lg mx-auto"
              style={{ width: "350px", height: "350px" }}
            />
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {lastScanned && (
            <div className="space-y-2">
              <div className="bg-white rounded p-2 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1">Signature</div>
                <div
                  className="text-gray-900 font-mono text-xs break-all cursor-pointer hover:bg-gray-100 p-1 rounded"
                  onClick={() => copyToClipboard(lastScanned)}
                >
                  {lastScanned}
                </div>
              </div>

              <div className="bg-white rounded p-2 border border-gray-100">
                <div className="text-xs text-gray-600 mb-1">
                  Recovered Address
                </div>
                {isRecoveringAddress ? (
                  <div className="flex items-center justify-center p-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                  </div>
                ) : (
                  <div
                    className="text-gray-900 font-mono text-xs break-all cursor-pointer hover:bg-gray-100 p-1 rounded"
                    onClick={() => copyToClipboard(retrivedAddress)}
                  >
                    {retrivedAddress}
                  </div>
                )}
              </div>

              <Button
          onClick={verifyAddress}
          disabled={isVerifying}
          className={`w-full relative ${
            verificationSuccess
              ? "bg-green-500 hover:bg-green-600"
              : "bg-black hover:bg-gray-800"
          } text-white transition-colors duration-300`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {verificationSuccess && (
              <motion.div
                initial={false}
                animate={{
                  opacity: verificationSuccess ? 1 : 0,
                  scale: verificationSuccess ? 1 : 0.5,
                }}
                className="flex items-center gap-3"
                transition={{ duration: 0.2 }}
              >
                <Check className="w-5 h-5" /> <p>Verified!</p>
              </motion.div>
            )}
            
            {!verificationSuccess && isVerifying && (
              <motion.div
                initial={false}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="w-5 h-5 animate-spin" />
              </motion.div>
            )}

            {!isVerifying && !verificationSuccess && (
              <motion.span
                initial={false}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{ duration: 0.2 }}
              >
                Verify
              </motion.span>
            )}
          </div>
        </Button>
            </div>
          )}
          
        </div>
      </div>
    </>
  );
};

export default QRScanner;