"use client";

import { Button } from "@/components/ui/button";
import CarouselComp from "@/components/Carousel";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import FlickeringGrid from "@/components/ui/flickering-grid";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      <FlickeringGrid
        className="-z-10 absolute inset-0 size-full"
        squareSize={20}
        gridGap={6}
        color="#6B7280"
        maxOpacity={0.2}
        flickerChance={0.1}
      />
      <div className="relative h-[85vh] md:max-h-screen flex flex-col justify-center items-center">
        <main className="overflow-hidden relative flex flex-col justify-center gap-16 max-sm:px-5">
          {/* flex flex-col justify-center items-start sm:max-w-[90%] */}
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[34px] leading-none md:text-7xl md:max-w-[60%] text-neutral-400 font-bold mb-3">
              Drop the <span className="text-white">Mask</span>, Keep the{" "}
              <span className="text-white">Mystery</span>, Own the{" "}
              <span className="text-white">Truth</span>
            </h1>
            <p className="text-[16px] font-normal text-gray-300">
              Explore{" "}
              <span className="font-semibold text-white">IncognitoBox</span> -
              Where your identity remains a secret...
            </p>
            {session && session.user ? (
              <Button
                onClick={() => router.push("/dashboard")}
                className="border-[#393838ca] border bg-[#0A0A0A] hover:bg-[#393838ca] mt-6"
              >
                Go to Dashboard...
              </Button>
            ) : (
              <div className="flex gap-5 mt-8">
                <Button
                  onClick={() => router.push("/signup")}
                  className="bg-yellow-50 text-black hover:text-white hover:bg-[#393838ca]"
                >
                  Explore
                </Button>
                <Button
                  onClick={() => router.push("/signin")}
                  className="border-[#393838ca] border bg-[#0A0A0A] hover:bg-[#393838ca]"
                >
                  Login
                </Button>
              </div>
            )}
          </div>

          <div className="sm:fixed sm:bottom-7 sm:right-5">
            <CarouselComp />
          </div>
        </main>

        <footer className="absolute bottom-5 sm:fixed sm:bottom-1">
          <p className="text-sm">
            {/* © 2024 Incognito Box. All rights reserved. */}
            Made with ❤ by @prynsustwt
          </p>
        </footer>
      </div>
    </>
  );
}
