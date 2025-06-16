import React from "react";
import Image from "next/image";

interface VideoMockupProps {
  src: string;
  height?: number;
}

export default function VideoMockup({ src, height = 400 }: VideoMockupProps) {
  return (
    <div
      className="relative flex h-[500px] items-center justify-center"
      style={{
        height: `${height}px`,
      }}
    >
      <Image
        src="/mockup.png"
        alt="iPhone Mockup"
        className="pointer-events-none relative top-0 left-0"
        aria-hidden="true"
        style={{
          height: `${height}px`,
          zIndex: 10,
        }}
        width={height * 0.5}
        height={height}
      />
      <video
        className="absolute top-1/2 left-1/2 z-0 h-[471.5px] -translate-x-1/2 -translate-y-1/2 transform"
        autoPlay
        loop
        muted
        playsInline
        style={{
          height: `${height * 0.943}px`,
          borderRadius: `${height * 0.058}px`,
          zIndex: 10,
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
