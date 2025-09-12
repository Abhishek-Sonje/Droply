"use client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Image,
} from "@heroui/react";
import { User } from "lucide-react";
// import Image from 'next/image';
import React from "react";
function ProfileCard() {
  return (
    <Card className="max-w-[400px]  bg-gradient-to-br from-[#0F1B0F] via-[#1B2A1B] to-[#3C4A3C]">
      <CardHeader className="flex justify-center items-center w-full">
        <div className="border-2 rounded-full p-4 bg-[#0f1B0F]">
          <User className="w-18 h-18 text-[#ffffff]" />
        </div>
      </CardHeader>
      <Divider />
      <CardBody></CardBody>
      <Divider />
      <CardFooter></CardFooter>
    </Card>
  );
}

export default ProfileCard;
