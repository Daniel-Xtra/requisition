import express from "express";
import { controllerHandler } from "../../shared/controllerHandler";
import { DivisionController } from "./divisionController";
import { DivisionValidationSchema } from "./divisionValidation";
import { adminAuthorize, authorize, validation } from "../../middleware";

const call = controllerHandler;
const Division = new DivisionController();
const router = express.Router();

// router.use(adminAuthorize);
router.use(validation(DivisionValidationSchema));

router.post(
  "/",

  call(Division.createDivision, (req, res, next) => [req.body])
);

router.put(
  "/:slug",
  adminAuthorize,
  call(Division.updateDivision, (req, res, next) => [req.params.slug, req.body])
);

router.delete(
  "/:slug",
  adminAuthorize,
  call(Division.delete, (req, res, next) => [req.params.slug])
);

router.get(
  "/",
  call(Division.getDivisions, (req, res, next) => [])
);

router.get(
  "/:slug",
  authorize,
  call(Division.getDivision, (req, res, next) => [req.params.slug])
);
export const DivisionRouter = router;
