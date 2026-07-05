"use client";

import { SerwistProvider } from "@serwist/next/react";

export default function PwaRegister({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={process.env.NODE_ENV !== "production"}
      register={true}
      cacheOnNavigation={true}
      reloadOnOnline={true}
    >
      {children}
    </SerwistProvider>
  );
}
