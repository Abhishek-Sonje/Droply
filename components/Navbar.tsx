"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";
import { CloudUpload, Files, User } from "lucide-react";

function NavbarPage({ activeTab }: { activeTab: string }) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <Navbar
      position="static"
      maxWidth="full"
      className="w-full justify-items-stretch bg-[#0F1B0F]  rounded-3xl "
      classNames={{
        item: [
          "flex",
          "relative",
          // "h-full",
          "py-2",
          "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-white",
        ],
      }}
    >
      <NavbarBrand className="cursor-pointer">
        {/* <Image
          src="/DroplyLogo.png"
          width={50}
          height={50}
          alt="Picture of the author"
        /> */}
        <Link href="/" className="text-xl font-bold">
          <CloudUpload className="text-[#efebe3] size-9" />
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive={activeTab==="files"}>
          <Link
            color="foreground"
            className="font-bold text-sky-100 gap-2 flex  hover:underline"
            href="/dashboard/files"
          >
            <Files />
            Files
          </Link>
        </NavbarItem>
        <NavbarItem className="overflow-hidden" isActive={activeTab==="profile"}>
          <Link
            color="foreground"
            className="font-bold  text-sky-100  gap-1.5 flex  hover:underline "
            href="/dashboard/profile"
          >
            <User /> Profile
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent as="div" justify="end">
        {isSignedIn ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button>{(user && user.firstName) || "User"}</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem
                key="logout"
                color="danger"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <>
            <Link href="/sign-in">
              <Button className="font-semibold  bg-sky-100 ">Log In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="font-semibold  bg-sky-100 ">Sign up</Button>
            </Link>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}

export default NavbarPage;
