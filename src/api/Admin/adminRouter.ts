import express from "express";
import { adminAuthorize } from "../../middleware";

import { controllerHandler } from "../../shared/controllerHandler";

import { AdminController } from "./adminController";

const router = express.Router();
const call = controllerHandler;
const Admin = new AdminController();

// router.use(adminAuthorize);

router.get(
  "/manage-users",
  [adminAuthorize],
  call(Admin.getAllUsers, (req, _res, _next) => [
    req.user,
    req.query.per_page,
    req.query.post_next,
    req.query.post_prev,
  ])
);

router.put(
  "/update-user/:username",
  [adminAuthorize],
  call(Admin.updateUser, (req, res, next) => [req.params.username, req.body])
);

export const AdminRouter = router;
