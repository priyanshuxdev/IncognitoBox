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
      <div className="relative h-[85vh] sm:max-h-screen flex flex-col justify-center items-center">
        <main className="overflow-hidden relative flex flex-col justify-center gap-16 max-sm:px-5">
          <section className="flex flex-col justify-center items-start sm:max-w-[90%]">
            <h1 className="text-[34px] leading-none sm:text-6xl font-semibold mb-3">
              Dive into the world of Anonymous Conversation
            </h1>
            <p className="text-sm font-thin">
              Explore <span className="font-semibold">IncognitoBox</span> -
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
          </section>
          <div className="sm:fixed sm:bottom-7 sm:right-5">
            <CarouselComp />
          </div>
        </main>

        <footer className="absolute bottom-5 sm:fixed sm:bottom-1">
          <p className="text-[10px]">
            © 2024 Incognito Box. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}
