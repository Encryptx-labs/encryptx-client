"use client";
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
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <Card className="w-[350px]">
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

  if (!ready) {
    return (
      <div className="h-screen w-full grid place-items-center animate-spin">
        <Loader2 />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="h-screen w-full grid place-items-center">
        <LoginUI />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default CustomLayout;
