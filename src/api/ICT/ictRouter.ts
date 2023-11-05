import express from "express";

import { controllerHandler } from "../../shared/controllerHandler";
import { IctController } from "./ictController";
import { authorizeICT } from "../../middleware";

const call = controllerHandler;
const ICT = new IctController();

const router = express.Router();

router.use(authorizeICT);

router.get(
  "/all",

  call(ICT.allRequest, (req, res, next) => [req.query])
);

export const IctRouter = router;
