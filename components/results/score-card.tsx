"use client";

import { MeetingPackage } from "@/types";
import { AlertTriangle, CheckCircle, ShieldCheck, TrendingUp } from "lucide-react";

/**
 * ScoreCard - The AdvisorFlow Score differentiator.
 *
 * Displays a prominent Compliance Readiness Score out of 100,
 * with color-coded status, identified issues, and recommended actions.
 * This is the sticky feature ChatGPT cannot easily replicate.
 */
export function ScoreCard({ package: pkg }: { package: MeetingPackage }) {
  const score = pkg.complianceScore;
  const isCritical = score < 50;
  const isWarning = score >= 50 && score < 70;
  const isGood = score >= 70 && score < 90;
  const isExcellent = score >= 90;

  const getScoreColor = () => {
    if (isCritical) return "text-red-600 border-red-200 bg-red-50";
    if (isWarning) return "text-amber-600 border-amber-200 bg-amber-50";
    if (isGood) return "text-blue-600 border-blue-200 bg-blue-50";
    return "text-emerald-600 border-emerald-200 bg-emerald-50";
  };

  const getScoreLabel = () => {
    if (isCritical) return "Critical";
    if (isWarning) return "Needs Attention";
    if (isGood) return "Good";
    return "Excellent";
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Score Header */}
      <div className={`p-6 border-b border-gray-200 ${getScoreColor()}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              AdvisorFlow Compliance Score
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Compliance Readiness Assessment
            </p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-bold">{score}</span>
            <span className="text-lg font-semibold">/ 100</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <div
            className="h-2 w-3/4 bg-gray-200 rounded-full overflow-hidden"
          >
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isCritical
                  ? "bg-red-500"
                  : isWarning
                    ? "bg-amber-500"
                    : isGood
                      ? "bg-blue-500"
                      : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(score, 100)}%` }}
            />
          </div>
          <span className="text-sm font-semibold ml-2">{getScoreLabel()}</span>
        </div>
      </div>

      {/* Issues */}
      {pkg.complianceIssues && pkg.complianceIssues.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h3 className="flex items-center gap-2 text-base font-semibold text-red-800 mb-4">
            <AlertTriangle className="h-5 w-5" />
            Issues Identified
          </h3>
          <ul className="space-y-3">
            {pkg.complianceIssues.map((issue, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-red-500 font-bold shrink-0">⚠</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {pkg.recommendedActions && pkg.recommendedActions.length > 0 && (
        <div className="p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-800 mb-4">
            <CheckCircle className="h-5 w-5" />
            Recommended Actions
          </h3>
          <ul className="space-y-3">
            {pkg.recommendedActions.map((action, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}