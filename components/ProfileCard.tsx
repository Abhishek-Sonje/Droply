"use client";
import { useClerk, useUser } from "@clerk/clerk-react";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Button,
} from "@heroui/react";
import { User } from "lucide-react";
// import Image from 'next/image';
import React from "react";

function ProfileCard() {
  const { signOut } = useClerk();
  const { user } = useUser();
  if (!user) {
    return <p>Loading...</p>;
  }
  // console.log("user",user);
  const email = user.primaryEmailAddress?.emailAddress ?? "No email";
  const name =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || email.split("@")[0];
  return (
    <div className="w-full h-full flex justify-center items-center align-middle">
      <Card className="max-w-[400px] min-w-[400px] -mt-24 bg-gradient-to-br from-[#0F1B0F] via-[#1B2A1B] to-[#3C4A3C] ">
        <CardHeader className="flex justify-center items-center w-full">
          <div className="border-2 rounded-full p-4 bg-[#0f1B0F]">
            <User className="w-18 h-18 text-[#ffffff]" />
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-[#ffffff] text-2xl font-bold">{name}</h1>
            <p className="text-[#ffffff] text-sm font-semibold">{email}</p>
            {/* <Divider className="my-4 bg-[#3C4A3C]" /> */}
          </div>
        </CardBody>
        <Divider className="mt-4 bg-[#3C4A3C]" />

        <CardFooter className="flex justify-center items-center w-full">
          <Button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full bg-danger text-white text-lg font-semibold my-2"
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProfileCard;
