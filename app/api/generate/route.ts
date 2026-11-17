import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompt";
import { MeetingPackage } from "@/types";

/**
 * POST /api/generate
 *
 * Server-side endpoint that calls OpenAI to transform raw meeting notes
 * into a structured MeetingPackage JSON object.
 *
 * Request body: { meetingNotes: string }
 * Response: MeetingPackage JSON
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { meetingNotes?: string };
    const { meetingNotes } = body;

    // Validate input
    if (!meetingNotes || typeof meetingNotes !== "string") {
      return NextResponse.json(
        { error: "Meeting notes are required" },
        { status: 400 }
      );
    }

    const trimmedNotes = meetingNotes.trim();
    if (trimmedNotes.length === 0) {
      return NextResponse.json(
        { error: "Meeting notes cannot be empty" },
        { status: 400 }
      );
    }

    // Initialize OpenAI client (reads OPENAI_API_KEY from env)
    const openai = getOpenAI();

    // Call OpenAI Chat Completions API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(trimmedNotes) },
      ],
      temperature: 0.5,
      // Request JSON output mode
      response_format: { type: "json_object" },
      max_tokens: 2500,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response" },
        { status: 502 }
      );
    }

    // Parse the JSON response
    let parsed: MeetingPackage;
    try {
      parsed = JSON.parse(content) as MeetingPackage;
    } catch (parseError) {
      console.error("Failed to parse OpenAI JSON response:", content);
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 }
      );
    }

    // Validate required fields exist (including South African compliance fields)
    const requiredFields: (keyof MeetingPackage)[] = [
      "clientSummary",
      "keyDiscussionPoints",
      "actionItemsForAdvisor",
      "actionItemsForClient",
      "outstandingDocuments",
      "riskFlags",
      "recommendedNextSteps",
      "followUpEmail",
      "ficaDocumentChecklist",
      "faisRecordOfAdvice",
      "popiaConsentItems",
      "complianceDisclosure",
      "regulatoryReferences",
      "complianceScore",
      "complianceIssues",
      "recommendedActions",
    ];

    for (const field of requiredFields) {
      if (parsed[field] === undefined || parsed[field] === null) {
        return NextResponse.json(
          { error: `AI response missing required field: ${field}` },
          { status: 502 }
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate API error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "OpenAI API key is not configured" },
          { status: 500 }
        );
      }
      return NextResponse.json(
        { error: error.message || "Failed to generate meeting package" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}