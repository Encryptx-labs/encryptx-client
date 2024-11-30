"use client";

import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { motion } from "framer-motion";
import { useEvents } from "@/context/event-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, fromUnixTime } from "date-fns";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Loader2,
  ArrowRight,
  Timer,
  Heart,
  Share2,
  PartyPopper,
  Coins,
} from "lucide-react";
import { categories } from "@/utils/categories";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  LINEA_SEPOLIA_ABI,
  LINEA_SEPOLIA_EVENT_CONTRACT,
  DUMMYABI,
  INCO_ADDRESS,
  USDCADDRESS,
  USDC_LINEA_SEPOLIA_ABI,
} from "@/utils/contracts";
import { parseUnits } from "ethers";

import { useFhevm } from "@/fhevm/fhevm-context";
import { ethers } from "ethers";
import { toHexString } from "@/fhevm/fhe-functions";
import { useWalletContext } from "@/privy/walletContext";
import TicketPurchaseDialog from "./alert";
import { TransactionHelper } from "@/utils/txhelper";
import { ensureFunding } from "@/utils/fundingHelper";

const STORAGE_KEY = "likedEvents";

export function EventsBentoGrid({
  userAddress,
}) {
  const { allEvents, loading, error, refreshEvents } = useEvents();
  const [likedEvents, setLikedEvents] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const txHelper = new TransactionHelper({
    minBalance: "0.1",
    fundingAmount: "0.1",
  });

  const { w0 } = useWalletContext();

  // useEffect(() => {
  //   const swiChain = async () => {
  //     await w0?.switchChain(84532);
  //   };
  //   swiChain();
  // }, []);

  const { signer } = useWalletContext();
  // Load liked events from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLikedEvents(JSON.parse(stored));
      }
      setIsInitialized(true);
    } catch (error) {
      console.error("Error loading likes:", error);
      setLikedEvents({});
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage when likes change
  useEffect(() => {
    if (isInitialized && Object.keys(likedEvents).length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedEvents));
    }
  }, [likedEvents, isInitialized]);

  const isEventLiked = (eventId) => {
    return likedEvents[userAddress]?.includes(eventId) || false;
  };

  const toggleLike = (eventId) => {
    console.log("sjhgv");
    setLikedEvents((prev) => {
      const userLikes = prev[userAddress] || [];
      const newUserLikes = userLikes.includes(eventId)
        ? userLikes.filter((id) => id !== eventId)
        : [...userLikes, eventId];

      return {
        ...prev,
        [userAddress]: newUserLikes,
      };
    });
  };

  const { instance } = useFhevm();
  console.log(instance);

  function generateWallet() {
    // Generate a random wallet
    const wallet = ethers.Wallet.createRandom();

    console.log("Address:", wallet.address); // Ethereum address //dev
    console.log("Private Key:", wallet.privateKey); // Private key //dev
    console.log("Mnemonic:", wallet.mnemonic.phrase); // Mnemonic phrase (optional)
    return wallet;
  }

  const handleBuyTicket = async (event, wallet) => {
    try {
      // Generate wallet and create encrypted input
      const wallet = await generateWallet();
      const input = await instance.createEncryptedInput(
        INCO_ADDRESS,
        userAddress
      );
      input.addAddress(wallet.address);
      const encryptedInput = input.encrypt();
      console.log(encryptedInput);

      // Convert input proof to hex string with '0x' prefix
      const inputProof = "0x" + toHexString(encryptedInput.inputProof);
      console.log(encryptedInput.handles[0], encryptedInput.inputProof);

      const fundingResult = await ensureFunding(
        userAddress, // address to fund
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

  const handleShare = async (event) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `Check out this event: ${event.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.success("Event link copied to clipboard!");
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  // const switchChain = async (chainId) => {
  //   try {
  //     const targetChain = chains.find(c => c.id === chainId);
  //     if (!targetChain) throw new Error('Unsupported chain');

  //     toast.loading('Switching network...', { id: 'chain-switch' });

  //     try {
  //       await switchChainAsync({ chainId });
  //       toast.success('Network switched successfully', { id: 'chain-switch' });
  //     } catch (switchError) {
  //       // If switching fails, try to add the chain first
  //       const added = await addChainToWallet(targetChain);
  //       if (added) {
  //         // Try switching again after adding
  //         await switchChainAsync({ chainId });
  //         toast.success('Network added and switched successfully', { id: 'chain-switch' });
  //       } else {
  //         throw new Error('Failed to add and switch chain');
  //       }
  //     }
  //     return true;
  //   } catch (error) {
  //     toast.error(`Failed to switch network: ${error.message}`, { id: 'chain-switch' });
  //     return false;
  //   }
  // };

  const addChainToWallet = async (chain) => {
    try {
      const provider = window?.ethereum;
      if (!provider?.request) {
        throw new Error("No provider available");
      }

      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chain.id.toString(16)}`,
            chainName: chain.name,
            nativeCurrency: chain.nativeCurrency,
            rpcUrls: chain.rpcUrls.default.http,
            blockExplorerUrls: [chain.blockExplorers?.default?.url],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to add chain:", error);
      return false;
    }
  };

  const [mint, setMint] = useState(false);

  const handleclick = async () => {
    try {
      setMint(true);
      const fundingResult = await ensureFunding(
        userAddress, // address to fund
        "linea", // network
        "0.1", // required balance
        "0.1" // funding amount
      );

      if (!fundingResult.success) {
        console.error("Funding failed:", fundingResult.message);
        return;
      }
      // Create contract instance
      const usdcContract = new ethers.Contract(
        USDCADDRESS,
        USDC_LINEA_SEPOLIA_ABI,
        signer // Make sure you have a valid signer instance
      );

      // Call the transferFromOwner function
      const transaction = await usdcContract.transferFromOwner(
        LINEA_SEPOLIA_EVENT_CONTRACT
      );

      // Wait for transaction confirmation
      const receipt = await transaction.getTransaction();
      await receipt.wait();

      console.log("Transaction successful:", receipt);
      toast.success("Transfer successful!", {
        description: `Block Scout: https://sepolia.lineascan.build/tx/${receipt.hash}`,
      });
      // Optionally, you can return the receipt for further processing
      return receipt;
    } catch (error) {
      console.error("Transfer error:", error);
      toast.error("Transfer failed", {
        description: error.message || "Unknown error occurred",
      });
      throw error; // Re-throw the error if you want to handle it in the calling function
    } finally {
      setMint(false);
    }
  };

  if (loading || !isInitialized) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refreshEvents} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const EventCard = ({ event }) => {
    const category = categories.find((cat) => cat.id === event.category);
    const eventDate = fromUnixTime(event.date.seconds);
    const isLiked = isEventLiked(event.id);
    const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);

    const handleTicketDialog = (event) => {
      setIsPurchaseDialogOpen(true);
    };

    return (
      <motion.div
        initial="initial"
        whileHover="animate"
        className="relative w-full h-full rounded-xl overflow-hidden bg-white dark:bg-gray-900 group"
      >
        {/* Top Image Section - Removed price tag */}
        <div className="relative h-[45%] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Top Badges - Same as before */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <Badge className={cn("backdrop-blur-md bg-white/10")}>
              {category?.icon}
              <span className="ml-1">{category?.name}</span>
            </Badge>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "rounded-full w-8 h-8 backdrop-blur-md hover:bg-white/20 text-white z-50",
                  isLiked ? "bg-red-500/20" : "bg-white/10"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(event.id);
                }}
              >
                <Heart
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isLiked ? "fill-red-500 text-red-500" : "fill-none"
                  )}
                />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full w-8 h-8 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(event);
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Section - Modified to include price */}
        <div className="h-[55%] px-6 pt-8 flex flex-col">
          {/* Event Title and Price Row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-xl font-bold line-clamp-1">{event.title}</h3>
            <Badge variant="secondary" className="px-3 py-1 text-lg font-bold">
              ${event.price}
              {/* $100 */}
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="flex items-center gap-3 text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{event.duration}min</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">{event.maxParticipants} spots</span>
            </div>
          </div>

          {/* DateTime and Location */}
          <div className="grid grid-cols-1 gap-2 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(eventDate, "EEEE, MMMM d")}</span>
              <span>•</span>
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          {/* Host Info and Buy Button */}
          <div className="mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 ring-2 ring-background">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${event.creatorAddress}`}
                />
                <AvatarFallback>
                  {event.creatorAddress.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Hosted by</span>
                <span className="text-sm font-medium truncate">
                  {event.creatorAddress.slice(0, 6)}...
                  {event.creatorAddress.slice(-4)}
                </span>
              </div>
            </div>

            <Button
              size="sm"
              className="group"
              onClick={(e) => {
                e.stopPropagation();
                handleTicketDialog(event);
              }}
            >
              Get Ticket
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <TicketPurchaseDialog
          event={event}
          isOpen={isPurchaseDialogOpen}
          onClose={() => setIsPurchaseDialogOpen(false)}
          onPurchase={handleBuyTicket}
        />
        {/* Floating Animation Elements - Same as before */}
        <motion.div
          className="absolute -right-4 -top-4 w-24 h-24 blur-3xl bg-primary/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        />
      </motion.div>
    );
  };

  const eventItems = allEvents.map((event) => ({
    header: <EventCard event={event} />,
    className: event === allEvents[0] ? "md:col-span-2" : "md:col-span-1",
  }));

  return (
    <div>
      <div className="max-w-7xl mx-auto md:auto-rows-[32rem] flex justify-end mb-8">
        <Button disabled={mint} variant='ghost'  onClick={handleclick}>
          <Coins className="cursor-pointer"  />
        </Button>
      </div>
      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[32rem]">
        {eventItems.map((item, i) => (
          <BentoGridItem
            key={i}
            header={item.header}
            className={cn("[&>p:text-lg]", item.className)}
          />
        ))}
      </BentoGrid>
    </div>
  );
}
