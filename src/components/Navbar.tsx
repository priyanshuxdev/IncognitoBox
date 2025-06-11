"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
// import { User } from "next-auth";
import { Button } from "./ui/button";
import { Star } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  // const user: User = session?.user as User;

  return (
    <>
      <nav className="m-4">
        <div className="flex justify-between mx-4 items-center">
          <Link className="text-xl md:text-2xl font-semibold" href={"/"}>
            IncognitoBox
          </Link>
          <div className="flex items-center gap-1 md:gap-4">
            {/* <a
                className="github-button"
                href="https://github.com/priyanshuxdev/incognitoBox"
                data-color-scheme="no-preference: light; light: light; dark: dark;"
                data-icon="octicon-star"
                data-size="large"
                data-show-count="true"
                aria-label="Star buttons/github-buttons on GitHub"
                >
                Star
                </a> */}
            <Link
              href={"https://github.com/priyanshuxdev/incognitoBox"}
              target="_blank"
            >
              <button className="flex items-center gap-3 group outline-none bg-neutral-900 px-4 py-1 border border-neutral-700 rounded-lg">
                <Star className="w-4 h-4 group-hover:fill-yellow-400 bg-neutral-800" />
                {"|"}
                <span>Star</span>
              </button>
            </Link>
            {session ? (
              <>
                {/* <span>Welcome, {user?.username || user?.email}</span> */}
                <Button
                  onClick={() => signOut()}
                  className="border-[#393838ca] border bg-[#0A0A0A] hover:bg-[#393838ca]"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/signin">
                <Button className="border-[#393838ca] border bg-[#0A0A0A] hover:bg-[#393838ca]">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
