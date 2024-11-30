'use client'
import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";

const CustomLayout = ({ children, linkset = "default" }) => {
  const { ready, login, authenticated } = usePrivy();

  const LoginUI = () => (
    <div className="relative h-full w-full flex items-center justify-center">
      <Card className="w-[350px] bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Hey!, Welcome to Encryptix,</CardTitle>
          <CardDescription>Connect your wallet to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full">
            Connect Wallet
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const backgroundStyles = {
    backgroundImage: "url('/bgimg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    
  };

  if (!ready) {
    return (
      <div 
        className="h-screen w-full grid place-items-center"
        style={backgroundStyles}
      >
        <div className="bg-white/50 p-4 rounded-full backdrop-blur-sm">
          <Loader2 className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div 
        className="h-screen w-full grid place-items-center"
        style={backgroundStyles}
      >
        <LoginUI />
      </div>
    );
  }

  return (
    <div>
        {children}
    </div>
  );
};

export default CustomLayout;