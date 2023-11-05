import express from "express";
import { StoreController } from "./storeController";
import { controllerHandler } from "../../shared/controllerHandler";
import { authorizeStore } from "../../middleware/authorization";

const call = controllerHandler;
const Store = new StoreController();

const router = express.Router();

router.use(authorizeStore);

router.get(
  "/all",
  call(Store.allRequest, (req, res, next) => [req.query])
);

export const StoreRouter = router;
