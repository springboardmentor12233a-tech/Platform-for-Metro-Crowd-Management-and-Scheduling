"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

/**
 * AuthGuard — wraps protected pages.
 * If no valid token is found, redirects to /login.
 * Shows nothing while checking to avoid a flash of protected content.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  // Don't render children until we've confirmed auth
  if (!checked) return null;

  return <>{children}</>;
}
