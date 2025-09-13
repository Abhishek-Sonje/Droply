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
import React from "react";

function ProfileCard() {
  const { signOut } = useClerk();
  const { user } = useUser();

  if (!user) {
    return <p>Loading...</p>;
  }

  const email = user.primaryEmailAddress?.emailAddress ?? "No email";
  const name =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || email.split("@")[0];

  return (
    <div className="w-full h-full flex justify-center items-center align-middle bg-[#F5EEDD]">
      <Card className="max-w-[400px] min-w-[400px] -mt-24 bg-[#06202B] shadow-xl rounded-2xl">
        <CardHeader className="flex justify-center items-center w-full">
          <div className="border-4 border-[#7AE2CF] rounded-full p-4 bg-[#06202B]">
            <User className="w-18 h-18 text-[#F5EEDD]" />
          </div>
        </CardHeader>

        <CardBody>
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-[#F5EEDD] text-2xl font-bold">{name}</h1>
            <p className="text-[#7AE2CF] text-sm font-medium">{email}</p>
          </div>
        </CardBody>

        <Divider className="mt-4 bg-[#7AE2CF]/40" />

        <CardFooter className="flex justify-center items-center w-full">
          <Button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full bg-[#7AE2CF] hover:bg-[#F5EEDD] text-[#06202B] text-lg font-semibold my-2 rounded-xl"
          >
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default ProfileCard;
