"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Mail, Download } from "lucide-react";
import { MeetingPackage } from "@/types";
import { exportToPDF } from "@/lib/pdf";

/**
 * Toolbar with Copy Results, Copy Email, and Export to PDF actions.
 */
interface CopyExportButtonsProps {
  package: MeetingPackage;
}

export function CopyExportButtons({ package: pkg }: CopyExportButtonsProps) {
  const [copied, setCopied] = useState<"results" | "email" | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleCopyResults = useCallback(async () => {
    const text = [
      "CLIENT MEETING PACKAGE",
      "========================",
      "",
      "CLIENT SUMMARY",
      pkg.clientSummary,
      "",
      "KEY DISCUSSION POINTS",
      ...pkg.keyDiscussionPoints.map((p) => `• ${p}`),
      "",
      "ACTION ITEMS FOR ADVISOR",
      ...pkg.actionItemsForAdvisor.map((a) => `• ${a}`),
      "",
      "ACTION ITEMS FOR CLIENT",
      ...pkg.actionItemsForClient.map((a) => `• ${a}`),
      "",
      "OUTSTANDING DOCUMENTS REQUIRED",
      ...pkg.outstandingDocuments.map((d) => `• ${d}`),
      "",
      "RISK FLAGS IDENTIFIED",
      ...pkg.riskFlags.map((r) => `• ${r}`),
      "",
      "RECOMMENDED NEXT STEPS",
      ...pkg.recommendedNextSteps.map((s) => `• ${s}`),
      "",
      "PROFESSIONAL FOLLOW-UP EMAIL",
      "==============================",
      pkg.followUpEmail,
    ].join("\n");

    await navigator.clipboard.writeText(text);
    setCopied("results");
    setTimeout(() => setCopied(null), 2000);
  }, [pkg]);

  const handleCopyEmail = useCallback(async () => {
    await navigator.clipboard.writeText(pkg.followUpEmail);
    setCopied("email");
    setTimeout(() => setCopied(null), 2000);
  }, [pkg.followUpEmail]);

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportToPDF("meeting-package", "advisorflow-meeting-package.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={handleCopyResults}
        disabled={copied === "results"}
      >
        <Copy className="h-4 w-4 mr-2" />
        {copied === "results" ? "Copied!" : "Copy Results"}
      </Button>

      <Button
        variant="outline"
        onClick={handleCopyEmail}
        disabled={copied === "email"}
      >
        <Mail className="h-4 w-4 mr-2" />
        {copied === "email" ? "Email Copied!" : "Copy Email"}
      </Button>

      <Button
        variant="accent"
        onClick={handleExportPDF}
        disabled={exporting}
        className="hidden sm:inline-flex"
      >
        <Download className="h-4 w-4 mr-2" />
        {exporting ? "Exporting…" : "Export to PDF"}
      </Button>

      {/* Mobile: stacked export button */}
      <Button
        variant="accent"
        onClick={handleExportPDF}
        disabled={exporting}
        className="sm:hidden w-full"
      >
        <Download className="h-4 w-4 mr-2" />
        {exporting ? "Exporting…" : "Export to PDF"}
      </Button>
    </div>
  );
}