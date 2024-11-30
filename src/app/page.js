"use client";
import HeadingWithAvatars from "@/components/hero/hero-avatars";
import FeatureSection from "@/components/hero/hero-feature-cards";
import Features from "@/components/hero/hero-features";
import HeroFooter from "@/components/hero/hero-footer";
import HeroSection from "@/components/hero/hero-section";
import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen p-8">
      <HeroSection />
      <HeadingWithAvatars />
      <Features />
      <FeatureSection />
      <HeroFooter />
    </div>
  );
};

export default Page;
