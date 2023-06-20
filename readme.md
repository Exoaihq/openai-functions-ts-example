# Open AI Functions TypeScript Example

[![Website](https://img.shields.io/badge/Website-getexo.dev-blue)](https://www.getexo.dev/)
[![Twitter Follow](https://img.shields.io/twitter/follow/kevinGrassi?style=social)](https://twitter.com/kevingrassi)

## Demo video:

https://youtu.be/BPviYFPFmFQ

## Quickstart

### Clone repos

```
git clone https://github.com/exoaihq/openai-functions-ts-example
cd openai-functions-ts-example
yarn install
```

### Add Open AI api key

Add you Open AI api key to the `.env-example` file and then change the file name to `.env`

### Run the server

```
yarn run dev
```

The server should start running on port 8080.

### Trigger the example function

The example in this repo gives the Open AI api the option to trigger two docker related functions: `startAContainer` and `runCommandInContainer`.

You'll need docker [installed on your machine](https://docs.docker.com/engine/install/).

The example function asks the api to clone and run a repo. The example repo is `https://github.com/kmgrassi/addressbook`

You can hardcode a different repo by changing line 15 in the `functions.controller.ts` file or by passing the url into the endpoint as a query parameter (in which case you can uncomment like 12-13)

To run the example, open up a browser window and nav to `http://localhost:8080/functions`

This will start the loop which will as the Open AI api to clone and run the repo in a docker container. You can add in some `console.logs` to follow the loops if you'd like (I removed them).

Feel free to reach out to me with any questions or issues with the code. Happy coding!
