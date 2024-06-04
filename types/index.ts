const GPT_MODEL = process.env.GPT_MODEL || "gpt-4o";

export const OpenAIModel = {
  DAVINCI_TURBO: GPT_MODEL
};

export interface Message {
  role: Role;
  content: string;
}

export type Role = "assistant" | "user";
