"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Rocket } from "lucide-react";

/**
 * Trial banner for the pay-per-use model.
 * Tracks report usage in localStorage (client-side only, no database).
 * First 5 reports are free; after that, prompts to purchase credits.
 */
export function TrialBanner({
  onPurchase,
  remaining = 5,
}: {
  onPurchase: () => void;
  remaining?: number;
}) {
  const [reportsRemaining, setReportsRemaining] = useState(remaining);

  useEffect(() => {
    // Load persisted trial count from localStorage
    const saved = localStorage.getItem("advisorflow_trial_remaining");
    if (saved !== null) {
      setReportsRemaining(parseInt(saved, 10) || remaining);
    }
  }, [remaining]);

  return reportsRemaining > 0 ? (
    <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 flex items-center gap-3">
      <Rocket className="h-5 w-5 text-blue-600 shrink-0" />
      <div>
        <h3 className="font-semibold text-blue-900">Free Trial Active</h3>
        <p className="text-sm text-blue-800">
          {reportsRemaining} report{reportsRemaining !== 1 ? "s" : ""} remaining
          in your free trial. Generate a meeting package to try it out.
        </p>
      </div>
    </div>
  ) : (
    <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 flex items-center gap-3">
      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
      <div>
        <h3 className="font-semibold text-amber-900">Trial Credits Used</h3>
        <p className="text-sm text-amber-800">
          You've used all 5 free trial reports. Purchase credits to continue
          generating FAIS-compliant meeting packages.
        </p>
      </div>
      <Button
        variant="accent"
        size="sm"
        onClick={() => {
          window.location.href = "/checkout";
        }}
      >
        Buy Credits
      </Button>
    </div>
  );
}

