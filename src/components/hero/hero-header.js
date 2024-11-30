import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOutIcon, Copy, Check } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { ChevronRight, Github, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateEventSheet from "../create-event";
import { useWalletContext } from "@/privy/walletContext";
import { Button } from "../ui/button";

const HeroHeader = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeRoute, setActiveRoute] = useState("/");
  const [showVideo, setShowVideo] = useState(false);
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const { logout } = usePrivy();
  const { authenticated } = usePrivy();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  const { address } = useWalletContext();

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy address:", err);
      }
    }
  };

  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
    }
  }, [pathname]);

  // Updated navigation items - "See Events" only
  const navItems = [{ path: "/see-events", label: "See Events" }];

  const handleCreateEventClick = (e) => {
    e.preventDefault(); // Prevent navigation
    setIsEventSheetOpen(true);
  };

  const renderNavItem = (item) => {
    const isActive = activeRoute === item.path;

    if (item.label === "Create Event") {
      return (
        <motion.div
          key="create-event"
          onClick={handleCreateEventClick}
          className={`
            h-9 rounded-full grid place-items-center px-4 cursor-pointer
            transition-colors duration-200
            bg-white hover:bg-gray-50 text-black
          `}
        >
          <span className="text-black">Create Event</span>
        </motion.div>
      );
    }

    return (
      <Link key={item.path} href={item.path} className="no-underline">
        <motion.div
          className={`
            h-9 rounded-full grid place-items-center px-4
            transition-colors duration-200
            ${
              isActive
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-white hover:bg-gray-50 text-black"
            }
          `}
        >
          <span
            className={`
            ${isActive ? "text-white" : "text-black"}
          `}
          >
            {item.label}
          </span>
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.div className="flex justify-between">
      <Link href="/" className="no-underline">
        <motion.div
          className={`bg-white p-1.5 rounded-full px-2.5 pr-4 hover:shadow-sm ${
            activeRoute === "/" ? "ring-2 ring-blue-600" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="bg-black w-9 h-9 rounded-full grid place-items-center p-1.5">
              <Image src="/logo1.svg" width={32} height={32} alt="Hero Image" />
            </div>
            <p className="text-black font-medium">Encryptix</p>
          </div>
        </motion.div>
      </Link>

      <div className="flex items-center gap-2">
        <div className="grid place-items-center">
          <Link href={"/verify"}
            className="group rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 hover:opacity-90 px-4 hover:underline"
            // onClick={() => setShowVideo(true)}
          >
            <p className="py-2">Verify</p>
          </Link>
        </div>
        <div className="bg-white p-1.5 rounded-full text-sm">
          <div className="flex items-center gap-2">
            {/* Add Create Event button directly in the navigation */}
            <motion.div
              onClick={handleCreateEventClick}
              className="h-9 rounded-full grid place-items-center px-4 cursor-pointer
                transition-colors duration-200 bg-white hover:bg-gray-50 text-black"
            >
              <span className="text-black">Create Event</span>
            </motion.div>
            {navItems.map(renderNavItem)}
          </div>
        </div>

        <div className="flex items-center gap-4 p-4">
          {address && authenticated && (
            <>
              <div className="flex items-center gap-2">
                <div className="font-mono bg-gray-100 px-3 py-1 rounded-full">
                  {truncateAddress(address)}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={copyToClipboard}
                  className="h-8 w-8 p-0"
                  title={copied ? "Copied!" : "Copy address"}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Create Event Sheet */}
      <CreateEventSheet
        isOpen={isEventSheetOpen}
        onOpenChange={setIsEventSheetOpen}
      />

      {/* Video Dialog */}
      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Protocol Demo</DialogTitle>
            <DialogDescription>
              Watch how our <span className="text-black">Encryptix</span> works.
            </DialogDescription>
          </DialogHeader>
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/JWXaH_IXKAc?si=mjVfDJdzQIGSHo57"
              title="Protocol Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default HeroHeader;