"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

interface SearchParams {
  title?: string;
  message?: string;
  url?: string;
  btn?: string;
}

export default function NoticeView({ searchParams }: { searchParams: SearchParams }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState<number>(3);

  const title = searchParams?.title || "Notice";
  const message = searchParams?.message || "No message provided.";
  const buttonUrl = searchParams?.url || "/";
  const btn = searchParams?.btn || "Continue";

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount > 1) {
          return prevCount - 1;
        } else {
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000);

    const redirect = setTimeout(() => {
      window.location.href = buttonUrl;
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [buttonUrl, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto">
      <div className="text-2xl font-bold mb-4">{title}</div>
      <div className="text-lg mb-8">{message}</div>
      <div className="mb-4">{countdown > 0 ? `Redirecting in ${countdown} seconds...` : "Redirecting..."}</div>
      <Button as="a" href={buttonUrl}>
        {btn}
      </Button>
    </div>
  );
}
