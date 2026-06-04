"use client";

import { useScreenSize } from "@/components/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";

export function PixelBackground() {
  const screenSize = useScreenSize();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <PixelTrail
        pixelSize={screenSize.lessThan("md") ? 32 : 48}
        fadeDuration={500}
        delay={200}
        pixelClassName="rounded-sm bg-[#f05555]/20"
      />
    </div>
  );
}
