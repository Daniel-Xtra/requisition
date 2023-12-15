import express from "express";
import { adminAuthorize } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { AdminController } from "./adminController";

const router = express.Router();
const call = controllerHandler;
const Admin = new AdminController();
router.use(adminAuthorize);

router.get(
  "/manage-users",

  call(Admin.getAllUsers, (req, _res, _next) => [req.query])
);

router.put(
  "/update-user/:email",

  call(Admin.updateUser, (req, res, next) => [req.params.email, req.body])
);

router.get(
  "/all-requisition",
  call(Admin.allRequest, (req, res, next) => [req.query])
);

export const AdminRouter = router;
