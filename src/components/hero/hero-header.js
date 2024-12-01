import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOutIcon, Copy, Check, Menu } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useWalletContext } from "@/privy/walletContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import CreateEventSheet from "../create-event";

const HeroHeader = () => {
  const [activeRoute, setActiveRoute] = useState("/");
  const [showVideo, setShowVideo] = useState(false);
  const [isEventSheetOpen, setIsEventSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const { logout } = usePrivy();
  const { authenticated } = usePrivy();
  const { address } = useWalletContext();

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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

  const handleCreateEventClick = (e) => {
    e.preventDefault();
    setIsEventSheetOpen(true);
  };

  // Desktop Header remains unchanged
  const renderDesktopHeader = () => (
    <div className="hidden md:flex justify-between">
      {/* Your original desktop header code here - unchanged */}
      <Link href="/" className="no-underline">
        <div className={`bg-white p-1.5 rounded-full px-2.5 pr-4 hover:shadow-sm ${
          activeRoute === "/" ? "ring-2 ring-blue-600" : ""
        }`}>
          <div className="flex items-center gap-4">
            <div className="bg-black w-9 h-9 rounded-full grid place-items-center p-1.5">
              <Image src="/logo1.svg" width={32} height={32} alt="Hero Image" />
            </div>
            <p className="text-black font-medium">StealthPass</p>
          </div>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        <div className="grid place-items-center">
          <Link href="/verify" className="group rounded-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 hover:opacity-90 px-4 hover:underline">
            <p className="py-2">Verify</p>
          </Link>
        </div>
        <div className="bg-white p-1.5 rounded-full text-sm">
          <div className="flex items-center gap-2">
            <motion.div
              onClick={handleCreateEventClick}
              className="h-9 rounded-full grid place-items-center px-4 cursor-pointer transition-colors duration-200 bg-white hover:bg-gray-50 text-black"
            >
              <span className="text-black">Create Event</span>
            </motion.div>
            <Link href="/see-events" className="no-underline">
              <div className={`h-9 rounded-full grid place-items-center px-4 transition-colors duration-200 ${
                activeRoute === '/see-events' ? "bg-black text-white hover:bg-gray-800" : "bg-white hover:bg-gray-50 text-black"
              }`}>
                <span className={activeRoute === '/see-events' ? "text-white" : "text-black"}>See Events</span>
              </div>
            </Link>
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
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
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
    </div>
  );

  return (
    <>
      {renderDesktopHeader()}

      {/* Mobile Header with shadcn Dropdown */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <Link href="/" className="no-underline">
          <div className="flex items-center gap-2">
            <div className="bg-black w-8 h-8 rounded-full grid place-items-center p-1">
              <Image src="/logo1.svg" width={24} height={24} alt="Hero Image" />
            </div>
            <p className="text-black font-medium">StealthPass</p>
          </div>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/verify">Verify</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={handleCreateEventClick}>
              Create Event
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/see-events">See Events</Link>
            </DropdownMenuItem>
            
            {address && authenticated && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono text-muted-foreground">
                      {truncateAddress(address)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyToClipboard}
                      className="h-6 w-6 p-0"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <DropdownMenuItem onSelect={logout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateEventSheet
        isOpen={isEventSheetOpen}
        onOpenChange={setIsEventSheetOpen}
      />

      <Dialog open={showVideo} onOpenChange={setShowVideo}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Protocol Demo</DialogTitle>
            <DialogDescription>
              Watch how our <span className="text-black">StealthPass</span> works.
            </DialogDescription>
          </DialogHeader>
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src=""
              title="Protocol Demo"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HeroHeader;
