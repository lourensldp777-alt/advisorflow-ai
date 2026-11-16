/**
 * TypeScript interfaces for AdvisorFlow AI Meeting Package.
 * These types define the structured output returned by the OpenAI API.
 */

export interface MeetingPackage {
  clientSummary: string;
  keyDiscussionPoints: string[];
  actionItemsForAdvisor: string[];
  actionItemsForClient: string[];
  outstandingDocuments: string[];
  riskFlags: string[];
  recommendedNextSteps: string[];
  followUpEmail: string;
}

/**
 * Individual section types for rendering in UI components.
 */
export interface SectionData {
  title: string;
  icon: string; // lucide-react icon name
  type: "text" | "list" | "email";
  content?: string;
  items?: string[];
}

/**
 * API request body for the generate endpoint.
 */
export interface GenerateRequest {
  meetingNotes: string;
}

/**
 * API response shape.
 */
export interface GenerateResponse {
  success: boolean;
  data?: MeetingPackage;
  error?: string;
}