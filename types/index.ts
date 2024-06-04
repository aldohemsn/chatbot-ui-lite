export enum OpenAIModel {
  DAVINCI_TURBO = "gpt-4o"
}

export interface Message {
  role: Role;
  content: string;
}

export type Role = "assistant" | "user";
