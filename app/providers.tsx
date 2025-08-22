"use client";
// app/providers.tsx
// import { ThemeProvider as NextThemesProvider } from "next-themes";

import { HeroUIProvider } from "@heroui/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
