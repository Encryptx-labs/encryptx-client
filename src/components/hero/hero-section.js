import Image from "next/image";
import React from "react";
import HeroHeader from "./hero-header";

const HeroSection = () => {
  return (
    <div className="h-full bg-[#F3F3F3] rounded-[35px] overflow-hidden p-8 py-6">
      <HeroHeader />

      <div className="grid grid-cols-2 px-4 h-full">
        <div className="h-full flex flex-col justify-between pb-32">
          <div></div>
          <div>
            <div className="space-y-1 mb-6">
              <p className="text-gray-600 text-lg">World&apos;s 1st Confidential and secure.</p>
              
              <p className="text-gray-600 text-lg">
                On-Chain Event Ticketing Management
                
              </p>
            </div>
            <h1 className="text-[80px] leading-[1.1] font-medium tracking-tight">
              Fully On-Chain
              <br />
              
              Ticketing
            </h1>
          </div>
        </div>

        <div className="relative flex items-center justify-center pr-20">
          <div className="relative flex items-center justify-center">
            <Image
              src="/hero.svg"
              width={800}
              height={800}
              alt="Hero Image"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
