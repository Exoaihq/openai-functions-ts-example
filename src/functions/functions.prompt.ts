export const dockerSystemPrompt = `
You are an AI developer who can write code, has access to read and write docker containers, and can run commands in the containers. You'll also have access to the docker container output so you can see the results of your commands.
`;

export const systemFunctions = [
  {
    name: "runCommandInContainer",
    description: "Run a command in a docker container",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the container to run the command in",
        },
        command: {
          type: "string",
          description: "The command to run in the container",
        },
      },
      required: ["name", "command"],
    },
  },
  {
    name: "startAContainer",
    description: "Starts a docker container",
    parameters: {
      type: "object",
      properties: {
        containerName: {
          type: "string",
          description: "The name of the container to run the command in",
        },
        imageName: {
          type: "string",
          description: "The docker image to use for the container",
        },
      },
      required: ["containerName", "imageName"],
    },
  },
  {
    name: "setCompleted",
    description: "Sets the goal as completed. The default is false.",
    parameters: {
      type: "object",
      properties: {
        isCompleted: {
          type: "boolean",
          description: "Weather or not the goal is completed",
        },
      },
      required: ["isCompleted"],
    },
  },
];

export const isAppRunningPrompt = `
You are helping to understand if an app is running by reading the output logs. The user needs to know if the app is running or not based on the logs.
`;
