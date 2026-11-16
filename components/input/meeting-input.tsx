"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, AlertCircle, Clipboard } from "lucide-react";

/**
 * Realistic demo meeting notes for financial advisers.
 */
export const DEMO_NOTES = `Met with Mr and Mrs Smith.

Discussed retirement planning.

Current living annuity value R3.2 million.

Need to review beneficiary nominations.

Spouse does not currently have a will.

Client wants to retire within 2 years.

Need updated FICA documents.`;

interface MeetingInputProps {
  onGenerate: (notes: string) => void;
  isLoading: boolean;
}

export function MeetingInput({ onGenerate, isLoading }: MeetingInputProps) {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!notes.trim()) {
      setError("Please enter meeting notes before generating.");
      return;
    }

    onGenerate(notes);
  };

  const handleLoadDemo = () => {
    setError("");
    setNotes(DEMO_NOTES);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-accent" />
          <CardTitle className="text-lg">Meeting Notes Input</CardTitle>
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          No database &bull; session only
        </span>
      </CardHeader>
      <CardContent className="pb-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="relative">
            <Textarea
              id="meeting-notes"
              placeholder="Paste your client meeting notes here…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
              className="min-h-[320px]"
              required
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {notes.length} characters
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleLoadDemo}
              className="flex-1"
            >
              <Clipboard className="h-4 w-4 mr-2" />
              Load Demo
            </Button>
            <Button
              type="submit"
              variant="default"
              size="lg"
              loading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              Generate Meeting Package
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}