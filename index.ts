import express, { Express, Request, Response } from "express";
import functionsRoutes from "./src/functions/functions.route";

const port = 8080;
const app: Express = express();

app.use("/functions", functionsRoutes);
app.use("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`[Server]: Running at https://localhost:${port}`);
});
