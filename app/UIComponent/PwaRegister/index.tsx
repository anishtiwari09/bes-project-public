"use client";

import { SerwistProvider } from "@serwist/next/react";
import { ENVIROMENT } from "../../backend/constant";

export default function PwaRegister({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SerwistProvider
      swUrl="/sw.js"
      disable={ENVIROMENT !== "production"}
      register={true}
      cacheOnNavigation={true}
      reloadOnOnline={true}
    >
      {children}
    </SerwistProvider>
  );
}
