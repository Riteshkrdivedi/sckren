import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";

const LandingPageNavbar = () => {
  return (
    <div className="flex w-full m-2 px-2 bg-secondary-foreground  justify-between items-center">
      <div className="flex items-center text-3xl font-bold gap-3">
        <Menu size={32} />
        <Link href="/">Sckren</Link>
      </div>
      <div className="hidden gap-x-10 items-center lg:flex">
        <Link
          className="hover:text-primary bg-primary/40 font-semibold text-lg px-2 py-1 rounded-md"
          href="/"
        >
          Home
        </Link>
        <Link href="/about">Pricing</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
      <div className="flex gap-3">
        <Link href="/auth/sign-in">
          <Button>
            <User fill="white" /> Login
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button>
            {" "}
            <User /> Register
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPageNavbar;
