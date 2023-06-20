import { Router } from "express";
import { runCloneRepo } from "./functions.controller";

const functionsRoutes = Router();

// Base route: /functions

functionsRoutes.get("/", runCloneRepo);

export default functionsRoutes;
