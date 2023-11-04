import express from "express";
// import { controllerHandler } from "../../shared/controllerHandler";
// import { RequestController } from "./requestController";
import { authorize } from "../../middleware";

// const call = controllerHandler;
// const Request = new RequestController();

const router = express.Router();

router.use(authorize);

export const RequestRouter = router;
