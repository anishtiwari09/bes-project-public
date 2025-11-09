"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const action = searchParams.get("action")?.[0];
  useEffect(() => {
    if (action === "login") {
      console.log("working");
    }
  }, [action]);

  return <>{children}</>;
}
