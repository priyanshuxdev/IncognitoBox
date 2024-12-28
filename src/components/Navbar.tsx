"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

export default function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <>
      <nav className="m-4">
        <div className="flex justify-between mx-4 items-center">
          <Link className="text-xl font-semibold" href={"/"}>
            IncognitoBox
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
      </nav>
    </>
  );
}
