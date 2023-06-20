import { Request, Response } from "express";

import { dockerSystemPrompt, systemFunctions } from "./functions.prompt";

import { execContainerByName, startAContainer } from "./functions.service";
import { ChatMessage, ChatUserType } from "../openAi/openAi.types";
import { createChatCompletion } from "../openAi/openAi.service";
import { removeBinaryCharacters } from "../utils/stringManipulation";

export const runCloneRepo = async (req: Request, res: Response) => {
  try {
    // The url can be passed in as a query parameter here, but for now we'll just hardcode it
    // const {url} = req.query;

    const url = "https://github.com/kmgrassi/addressbook";
    let done = false;
    let messages = [
      {
        role: ChatUserType.user,
        content: `Run the addressbook repo, run the start command and fix the code if it doesn't work: ${url}`,
      },
    ] as ChatMessage[];

    for (let i = 0; i < 10 && !done; i++) {
      try {
        const openAiResponse = await createChatCompletion({
          messages: [
            {
              role: ChatUserType.system,
              content: dockerSystemPrompt,
            },
            ...messages,
          ],
          functions: systemFunctions,
        }).catch((error: any) => {
          console.log("error", error);
          return;
        });

        if (openAiResponse?.functionCall) {
          const { name, functionArguments } = openAiResponse.functionCall;

          let output = null;
          if (name === "runCommandInContainer") {
            output = await execContainerByName(functionArguments);
          } else if (name === "startAContainer") {
            output = await startAContainer(functionArguments);
          }

          if (name === "setCompleted") {
            done = true;
            return;
          }

          if (output && name) {
            messages.push({
              role: ChatUserType.function,
              name: name || "",
              content:
                output && output.message
                  ? `Output of ${name}: ${removeBinaryCharacters(
                      output.message
                    )}`
                  : "No output",
            });
          }
        }
      } catch (error) {
        console.log("error", error);
      }
    }

    return res.status(200).json({
      data: "ok",
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
