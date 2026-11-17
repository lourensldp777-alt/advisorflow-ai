"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Payment success page.
 * Adds purchased credits to localStorage and redirects user back to generator.
 */
export default function CheckoutSuccess() {
  const [creditsAdded, setCreditsAdded] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    // PayFast redirects with custom_int1 = credit count
    const urlParams = new URLSearchParams(window.location.search);
    const customInt1 = urlParams.get("custom_int1");
    const paymentStatus = urlParams.get("payment_status");

    if (paymentStatus === "COMPLETE" && customInt1) {
      const credits = parseInt(customInt1, 10) || 0;

      // Add to existing credits
      const existing = parseInt(
        localStorage.getItem("advisorflow_credits") || "0",
        10
      );
      const newTotal = existing + credits;

      localStorage.setItem("advisorflow_credits", String(newTotal));

      setCreditsAdded(credits);
      setTotalCredits(newTotal);
    } else {
      // Show existing balance if no payment params
      const existing = parseInt(
        localStorage.getItem("advisorflow_credits") || "0",
        10
      );
      setTotalCredits(existing);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-emerald-600" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Payment Successful
          </CardTitle>
        </CardHeader>
        <CardContent>
          {creditsAdded > 0 ? (
            <>
              <p className="text-gray-600 mb-4">
                {creditsAdded} credit{creditsAdded !== 1 ? "s" : ""} added to
                your account.
              </p>
              <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Total Credits Available
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalCredits}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 mb-6">
              Your payment was processed successfully.
            </p>
          )}

          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Return to Generator
          </Button>

          <p className="mt-4 text-xs text-gray-400">
            Credits are stored locally in your browser. Clearing browser data
            will reset your balance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}