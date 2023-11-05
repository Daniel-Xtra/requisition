import express from "express";
import { controllerHandler } from "../../shared/controllerHandler";
import { RequestController } from "./requestController";
import { authorize, authorizeICT, validation } from "../../middleware";
import {
  IctValidationSchema,
  RequestValidationSchema,
  StoreValidationSchema,
} from "./requestValidation";
import { authorizeStore } from "../../middleware/authorization";

const call = controllerHandler;
const Request = new RequestController();

const router = express.Router();

router.use(authorize);

router.get(
  "/:unique_id",
  call(Request.fetchRequest, (req, res, next) => [req.params.unique_id])
);

router.post(
  "/",
  validation(RequestValidationSchema),
  call(Request.makeRequest, (req, res, next) => [req.user, req.body])
);

router.put(
  "/:unique_id",
  authorizeICT,
  validation(IctValidationSchema),
  call(Request.reviewICT, (req, res, next) => [
    req.user,
    req.params.unique_id,
    req.body,
  ])
);

router.put(
  "/:unique_id/store",
  authorizeStore,
  validation(StoreValidationSchema),
  call(Request.reviewStore, (req, res, next) => [
    req.user,
    req.params.unique_id,
    req.body,
  ])
);

router.get(
  "/individual/request",
  call(Request.individualRequest, (req, res, next) => [req.user, req.query])
);

export const RequestRouter = router;
