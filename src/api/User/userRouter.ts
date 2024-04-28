import express from "express";
import { authorize } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { UserController } from "./userController";
//import { UserValidationSchema } from "./userValidation";

const router = express.Router();
const call = controllerHandler;
const User = new UserController();

router.use(authorize);
//router.use(validation(UserValidationSchema));

router.get(
  "/",
  call(User.index, (req, res, next) => [])
);

// router.put(
//   "/",
//   call(User.updateUser, (req, res, next) => [req.user, req.body])
// );

router.get(
  "/:username",
  call(User.getUser, (req, res, next) => [req.params.username])
);

router.delete(
  "/delete-account/:username",
  call(User.deleteAccount, (req, res, next) => [req.params.username])
);

router.put(
  "/",
  call(User.changePassword, (req, _res, _next) => [req.user, req.body])
);

export const UserRouter = router;
