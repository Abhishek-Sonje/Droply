"use client";

import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/react";
import { ImageKitProvider } from "imagekitio-next";

const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication request failed");
  }
};

export interface providerProps {
  children: React.ReactNode;
  themeProp?: ThemeProviderProps;
}

export function Providers({ children, themeProp }: providerProps) {
  return (
    <ImageKitProvider
      authenticator={authenticator}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
    >
      <HeroUIProvider>{children}</HeroUIProvider>;
    </ImageKitProvider>
  );
}
