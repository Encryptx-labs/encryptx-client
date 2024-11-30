import { Poppins } from "next/font/google";
import "./globals.css";
import PrivyWrapper from "@/privy/privyProvider";
import ConnectWallet from "@/components/wallet-checker";
import IsLoggedIn from "@/components/isloggesin";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Encryptix.",
  description: "Eth Global",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <PrivyWrapper>
          <ConnectWallet>
            <IsLoggedIn>{children}</IsLoggedIn>
          </ConnectWallet>
        </PrivyWrapper>
        <Toaster />
      </body>
    </html>
  );
}
