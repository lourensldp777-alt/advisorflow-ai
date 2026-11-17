"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildPayFastUrl, getPayFastConfig } from "@/lib/payfast";
import { CreditCard, RotateCcw, AlertCircle } from "lucide-react";

/**
 * Checkout page for purchasing AdvisorFlow AI credits.
 * Pay-per-use model — South African IFAs pay R50 per report.
 * Redirects to PayFast for payment, then returns to /checkout/success.
 */
const CREDIT_PACKAGES = [
  { credits: 5, price: 50, label: "Starter" },
  { credits: 10, price: 90, label: "Popular", saving: "Save R10" },
  { credits: 25, price: 200, label: "Professional", saving: "Save R50" },
];

export default function CheckoutPage() {
  const [redirecting, setRedirecting] = useState(false);

  const handlePurchase = (credits: number, price: number) => {
    setRedirecting(true);

    const config = getPayFastConfig();
    const url = buildPayFastUrl({
      config,
      item: {
        name: `AdvisorFlow AI - ${credits} Meeting Package Credits`,
        amount: price,
      },
      customInt1: credits.toString(),
    });

    // Redirect to PayFast
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">A</span>
            <span className="font-semibold text-primary">AdvisorFlow AI</span>
          </div>
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-primary underline"
          >
            ← Back to Generator
          </a>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Purchase Credits
          </h1>
          <p className="text-gray-600">
            Pay-per-use — no subscription. Credits are added to your account
            after payment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {CREDIT_PACKAGES.map((pkg) => {
            const pricePerCredit = (pkg.price / pkg.credits).toFixed(0);
            return (
              <Card
                key={pkg.credits}
                className={`${
                  pkg.label === "Popular"
                    ? "ring-2 ring-accent bg-amber-50"
                    : ""
                } overflow-hidden`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {pkg.label}{" "}
                      {pkg.saving ? <span className="text-xs font-medium text-amber-600 ml-2">{pkg.saving}</span> : null}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center">
                    <span className="text-4xl font-bold text-primary">
                      R{pkg.price}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {pkg.credits} credit{pkg.credits !== 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ≈ R{pricePerCredit} per report
                    </p>
                    <Button
                      key={pkg.credits}
                      onClick={() => handlePurchase(pkg.credits, pkg.price)}
                      disabled={redirecting}
                      className="w-full mt-4"
                      variant={pkg.label === "Popular" ? "accent" : "default"}
                    >
                      {redirecting ? "Redirecting…" : "Buy Now"}
                    </Button>
                    {pkg.label === "Popular" && (
                      <p className="text-xs text-amber-600 mt-2">
                        Most popular
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-lg bg-amber-50 border border-amber-200">
          <h3 className="font-semibold text-amber-900 mb-2">
            How it works
          </h3>
          <ol className="text-sm text-amber-800 list-decimal list-inside space-y-1">
            <li>Select a credit package above.</li>
            <li>You'll be redirected to PayFast to pay securely.</li>
            <li>After payment, you'll return here and your credits will be added.</li>
            <li>Use credits to generate FAIS-compliant meeting packages.</li>
          </ol>
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-gray-500">
          <RotateCcw className="h-4 w-4 animate-spin" />
          <span>Powered by PayFast — Secure South African payments</span>
        </div>
      </main>
    </div>
  );
}