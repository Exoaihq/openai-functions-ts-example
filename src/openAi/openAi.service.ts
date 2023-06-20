import { BaseChat, ChatResponse, EngineName } from "./openAi.types";
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function createChatCompletion({
  messages,
  model = EngineName.Turbo,
  temperature = 1,
  maxTokens = 2048,
  stop,
  functions,
}: BaseChat): Promise<ChatResponse> {
  try {
    const res = await openai.createChatCompletion({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stop,
      functions,
    });
    if (res.status === 429) {
      console.log("Too many requests");
      setTimeout(() => {
        createChatCompletion({ messages, model, temperature, maxTokens });
      }, 2000);
    }

    return {
      content: res?.data?.choices[0]?.message?.content,
      functionCall: {
        name: res?.data?.choices[0]?.message?.function_call?.name,
        functionArguments:
          res?.data?.choices[0]?.message?.function_call?.arguments &&
          JSON.parse(res?.data?.choices[0]?.message?.function_call?.arguments),
      },
    };
  } catch (error: any) {
    console.log("error", error);
    return {
      content: `Error: ${error.message}`,
    };
  }
}
