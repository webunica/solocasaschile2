import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export const openai = new OpenAI({
  apiKey: apiKey || 'missing_key_for_build',
});
