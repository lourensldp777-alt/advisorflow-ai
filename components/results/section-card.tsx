"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SectionType = "text" | "list" | "email";

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  content?: string;
  items?: string[];
  type?: SectionType;
}

/**
 * Renders a single section of the meeting package.
 * Supports plain text, bulleted lists, and email-style content.
 */
export function SectionCard({
  title,
  icon,
  content,
  items,
  type = "text",
}: SectionCardProps) {
  return (
    <Card className="h-full border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10 text-accent shrink-0">
            {icon}
          </div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-6">
        {type === "list" && items ? (
          <ul className="space-y-3 text-gray-700">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 leading-relaxed">
                <span className="text-accent font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
            {items.length === 0 && (
              <li className="text-gray-400 text-sm italic">
                None identified.
              </li>
            )}
          </ul>
        ) : (
          <div className="whitespace-pre-line text-gray-700 leading-relaxed">
            {content || (
              <p className="text-gray-400 text-sm italic">
                No content generated for this section.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}