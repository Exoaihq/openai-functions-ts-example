export enum EngineName {
  GPT4 = "gpt-4-0613",
  Turbo = "gpt-3.5-turbo-0613",
}

export type BaseChat = {
  messages: ChatMessage[];
  model?: EngineName;
  temperature?: number;
  maxTokens?: number;
  stop?: string[] | null;
  functions?: any;
};

export type ChatMessage = {
  role: ChatUserType;
  content: string;
  name?: string;
};

export enum ChatUserType {
  system = "system",
  user = "user",
  assistant = "assistant",
  function = "function",
}

export type ChatResponse = {
  content: string;
  functionCall?: FunctionCall;
};

export type FunctionCall = {
  name: string;
  // example arguments:     arguments: '{\n  "location": "Boston, MA",\n  "unit": "celsius"\n}'
  functionArguments: any;
};
