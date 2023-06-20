import Docker from "dockerode";

import { isAppRunningPrompt } from "./functions.prompt";

import { ChatUserType } from "../openAi/openAi.types";
import { createChatCompletion } from "../openAi/openAi.service";

const docker = new Docker();

export async function startAContainer({
  containerName,
  imageName,
}: {
  containerName: string;
  imageName: string;
}): Promise<{
  container: Docker.Container;
  message: string;
}> {
  try {
    const container = await findContainerByNameAndStopAndRestart(containerName);

    if (!container) {
      return {
        container: await pullImageAndStartContainer(imageName, containerName),
        message: "Container started",
      };
    }

    return {
      container,
      message: "Container already exists",
    };
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findContainerByNameAndStopAndRestart(
  containerName: string
) {
  const found = await getContainerByName(containerName);

  if (!found) {
    return null;
  }

  const { container, foundContainer } = found;

  if (foundContainer.State === "running") {
    console.log("Container is already running");
  } else {
    await container.start();
  }

  return container;
}

export async function pullDockerImage(imageName: string): Promise<void> {
  const stream = await docker.pull(imageName);

  return new Promise((resolve, reject) => {
    docker.modem.followProgress(stream, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function createContainer(
  name: string,
  image: string
): Promise<Docker.Container> {
  const container = await docker.createContainer({
    Image: image,
    Cmd: ["tail", "-f", "/dev/null"],
    Entrypoint: ["/bin/sh", "-c"],
    Tty: true,
    name,
  });

  await container.start();
  return container;
}

export async function pullImageAndStartContainer(
  imageName: string,
  containerName: string
) {
  await pullDockerImage(imageName);

  return await createContainer(containerName, imageName);
}

export async function getContainerByName(name: string): Promise<{
  container: Docker.Container;
  foundContainer: Docker.ContainerInfo;
} | null> {
  const containers = await docker.listContainers({
    all: true,
  });

  const foundContainer = containers.find((c) => c.Names.includes(`/${name}`));

  if (!foundContainer) {
    return null;
  } else {
    const container = await docker.getContainer(foundContainer.Id);
    return {
      container,
      foundContainer,
    };
  }
}

export async function execContainerByName({
  name,
  command,
}: {
  name: string;
  command: string;
}): Promise<{
  message: string;
}> {
  return new Promise<{
    message: string;
  }>(async (resolve, reject) => {
    const found = await getContainerByName(name);
    if (!found) {
      reject("Container not found");
      return;
    }
    const { container } = found;

    const exec = await container.exec({
      Cmd: ["sh", "-c", command],
      AttachStdout: true,
      AttachStderr: true,
    });

    let output = "";

    const stream = await exec.start({ hijack: true, stdin: true });

    container.modem.demuxStream(stream, process.stdout, process.stderr);

    stream.on("data", async (chunk: { toString: () => string }) => {
      output += chunk.toString();

      console.log("chunk", chunk.toString() + ">>>>>>>>>>>>>end");
    });

    stream.on("end", () => {
      if (output.length > 300) {
        output = output.slice(-300);
      }
      resolve({
        message: output,
      });
    });

    stream.on("error", (err: any) => {
      console.log("err", err);
      reject(err);
    });

    setTimeout(async () => {
      const isRunningResponse = await createChatCompletion({
        messages: [
          {
            role: ChatUserType.system,
            content: isAppRunningPrompt,
          },
          {
            role: ChatUserType.user,
            content: `Based on this output, is the app running? ${output}}`,
          },
        ],
      });
      if (output.length > 300) {
        output = output.slice(-300);
      }
      resolve({
        message: isRunningResponse.content,
      });
    }, 2 * 60 * 1000);
  });
}

export async function setCompleted({ isCompleted }: { isCompleted: boolean }) {
  return new Promise((resolve) => {
    resolve(isCompleted);
  });
}
