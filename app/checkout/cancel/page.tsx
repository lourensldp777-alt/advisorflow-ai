"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowRight } from "lucide-react";

/**
 * Payment cancelled page.
 */
export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-amber-600" />
        </div>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">
            Payment Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Your payment was not completed. No charges were made.
          </p>
          <Button
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Return to Generator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}