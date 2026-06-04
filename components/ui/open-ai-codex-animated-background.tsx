"use client";

import { cn } from "@/lib/utils";
import Script from "next/script";

export const CodexAnimatedBackground = () => {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none")}>
      <Script 
        src="https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js" 
        strategy="afterInteractive" 
        onLoad={() => {
          if (typeof window !== "undefined" && (window as any).UnicornStudio) {
            (window as any).UnicornStudio.init();
          }
        }}
      />
      <div 
        data-us-project="1grEuiVDSVmyvEMAYhA6" 
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
};
