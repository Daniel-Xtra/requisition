import express from "express";
import passport from "passport";
import {
  loginStrategy,
  signupStrategy,
  adminLoginStrategy,
} from "../../middleware/passport";
import { validation } from "../../middleware/validation";
import { controllerHandler } from "./../../shared/controllerHandler";
import { AuthController } from "./authController";
import {
  LoginValidationSchema,
  SignupValidationSchema,
  RefreshTokensValidationSchema,
} from "./authValidation";
import { authorize } from "../../middleware";

const router = express.Router();
const call = controllerHandler;
const Auth = new AuthController();

passport.use("signup", signupStrategy);
passport.use("login", loginStrategy);
passport.use("adminLogin", adminLoginStrategy);

router.post(
  "/signup",
  [
    validation(SignupValidationSchema),
    passport.authenticate("signup", { session: false }),
  ],
  call(Auth.signup, (req, res, next) => [req.user]),
);

router.post(
  "/signin",
  [validation(LoginValidationSchema)],
  call(Auth.login, (req, res, next) => [req, res, next]),
);

router.post(
  "/admin-signin",
  [validation(LoginValidationSchema)],
  call(Auth.adminLogin, (req, res, next) => [req, res, next]),
);

router.post(
  "/logout",
  authorize,
  call(Auth.logout, (req, _res, _next) => [req.user]),
);

router.post(
  "/request-reset/:email",
  call(Auth.requestPasswordReset, (req, _res, _next) => [req.params.email, req.body]),
);

router.get(
  "/verify-code",
  call(Auth.verifyResetCode, (req, _res, _next) => [req.query.c]),
);

router.get(
  "/validate-username/:username",
  call(Auth.validateUsername, (req, _res, _next) => [req.params.username]),
);

router.get(
  "/validate-email/:email",
  call(Auth.validateEmail, (req, _res, _next) => [req.params.email]),
);
router.get(
  "/validate-phone/:phone",
  call(Auth.validatePhone, (req, _res, _next) => [req.params.phone]),
);

router.post(
  "/reset-password",
  call(Auth.resetPassword, (req, _res, _next) => [
    req.body.code,
    req.body.password,
  ]),
);

router.post(
  "/refresh-token",
  validation(RefreshTokensValidationSchema),
  call(Auth.refreshTokens, (req, res, next) => [req.body.refreshToken]),
);

router.post(
  "/:id/generateTokens",
  validation(RefreshTokensValidationSchema),
  call(Auth.refreshTokensById, (req, res, next) => [
    req.params.id,
    req.body.refreshToken,
  ]),
);

router.get("/", (rq, rs) => rs.send("good"));

export const AuthRouter = router;
