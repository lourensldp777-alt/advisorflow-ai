import { OpenAI } from "openai";

/**
 * Singleton OpenAI client instance.
 * Reads API key from OPENAI_API_KEY environment variable.
 * This module is imported only on the server side (API route).
 */
export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY environment variable is not set. Please add it to your .env.local file."
    );
  }

  return new OpenAI({ apiKey });
}