"use client";

import { useState, useCallback, useEffect } from "react";
import { MeetingPackage } from "@/types";
import { Hero } from "@/components/landing/hero";
import { TrialBanner } from "@/components/landing/trial-banner";
import { CreditsBanner } from "@/components/landing/credits-banner";
import { MeetingInput } from "@/components/input/meeting-input";
import { ResultsDisplay } from "@/components/results/results-display";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Loader2, ShieldCheck } from "lucide-react";

/**
 * Main page component for AdvisorFlow AI.
 *
 * Manages client-side state for:
 * - User meeting notes input
 * - Loading state during API call
 * - Generated meeting package results
 * - Error messages
 *
 * All data lives in memory only; nothing is persisted to a database.
 */
export default function HomePage() {
  const [meetingNotes, setMeetingNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [meetingPackage, setMeetingPackage] = useState<MeetingPackage | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [trialReportsRemaining, setTrialReportsRemaining] = useState(5);
  const [trialExpired, setTrialExpired] = useState(false);
  const [purchasedCredits, setPurchasedCredits] = useState(0);

  useEffect(() => {
    // Load persisted trial count from localStorage
    const saved = localStorage.getItem("advisorflow_trial_remaining");
    if (saved !== null) {
      const remaining = parseInt(saved, 10) || 5;
      setTrialReportsRemaining(remaining);
      setTrialExpired(remaining <= 0);
    }

    // Load purchased credits from localStorage
    const purchased = localStorage.getItem("advisorflow_credits");
    if (purchased !== null) {
      setPurchasedCredits(parseInt(purchased, 10) || 0);
    }
  }, []);

  const totalCreditsAvailable = trialReportsRemaining + purchasedCredits;

  const handleGenerate = useCallback(async (notes: string) => {
    if (totalCreditsAvailable <= 0) {
      setError("No credits available. Purchase credits to continue.");
      return;
    }

    setError(null);
    setMeetingNotes(notes);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingNotes: notes }),
        // 30 second timeout
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody.error || `API request failed with status ${response.status}`
        );
      }

      const data: MeetingPackage = await response.json();
      setMeetingPackage(data);

      // Decrement credits: purchased credits first, then trial credits
      if (purchasedCredits > 0) {
        const nextPurchased = purchasedCredits - 1;
        setPurchasedCredits(nextPurchased);
        localStorage.setItem("advisorflow_credits", String(nextPurchased));
      } else {
        const nextTrial = Math.max(0, trialReportsRemaining - 1);
        setTrialReportsRemaining(nextTrial);
        setTrialExpired(nextTrial <= 0);
        localStorage.setItem(
          "advisorflow_trial_remaining",
          String(nextTrial)
        );
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        setError(
          "The request timed out. Please try again with shorter meeting notes."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      setMeetingPackage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePurchase = () => {
    // Redirect to checkout for PayFast payment
    window.location.href = "/checkout";
  };

  const handleReset = () => {
    setMeetingPackage(null);
    setError(null);
    setMeetingNotes("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        <TrialBanner
          onPurchase={handlePurchase}
          remaining={trialReportsRemaining}
        />

        {/* Privacy Badge */}
        <div className="mb-6 flex items-center justify-between px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-600">
          <ShieldCheck className="h-4 w-4 mr-2 text-accent" />
          <span className="font-medium">POPIA-compliant — no client data stored</span>
          <span className="text-gray-400">Session only • Cleared on refresh</span>
        </div>

        {/* Credits Banner */}
        <CreditsBanner />

        {/* Input Card */}
        <Card className="mb-8">
          <MeetingInput
            onGenerate={handleGenerate}
            isLoading={isLoading}
            creditsAvailable={totalCreditsAvailable}
          />
        </Card>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-800 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <h3 className="font-semibold">Error</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:underline text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Results Card */}
        {meetingPackage && (
          <Card>
            <ResultsDisplay package={meetingPackage} />
          </Card>
        )}

        {/* Empty state hint */}
        {!meetingPackage && !error && totalCreditsAvailable > 0 && (
          <div className="mt-8 flex items-center justify-center py-12 text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <p>
                Ready to generate. Paste meeting notes above and click
                <span className="font-semibold">Generate Meeting Package</span>.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-primary font-medium">
              Generating your FAIS-compliant meeting package…
            </p>
          </div>
        </div>
      )}
    </div>
  );
}