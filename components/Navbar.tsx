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

function NavbarPage() {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <Navbar
      position="static"
      maxWidth="full"
      className="w-full justify-items-stretch bg-gray-900"
    >
      <NavbarBrand>
        <Image
          src="/DroplyLogo.png"
          width={50}
          height={50}
          alt="Picture of the author"
        />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link
            color="foreground"
            className="font-bold text-sky-100"
            href="/dashboard/files"
          >
            Files
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            color="foreground"
            className="font-bold  text-sky-100"
            href="/dashboard/profile"
          >
            Profile
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
