"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile");
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#0b0f19] text-cyan-400 font-mono">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        <p className="text-xs tracking-wider">REDIRECTING TO OPERATOR PROFILE...</p>
      </div>
    </div>
  );
}
