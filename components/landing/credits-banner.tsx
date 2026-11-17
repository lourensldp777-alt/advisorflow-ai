"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import Link from "next/link";

/**
 * Displays the user's current credit balance.
 * Credits are stored in localStorage (client-side only, MVP).
 */
export function CreditsBanner() {
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("advisorflow_credits");
    setCredits(saved ? parseInt(saved, 10) : 0);
  }, []);

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200">
      <CreditCard className="h-4 w-4 text-accent" />
      <span className="text-sm font-medium text-gray-700">
        {credits} credit{credits !== 1 ? "s" : ""} available
      </span>
      <Link
        href="/checkout"
        className="ml-auto text-sm text-accent font-semibold hover:underline"
      >
        Buy More Credits
      </Link>
    </div>
  );
}