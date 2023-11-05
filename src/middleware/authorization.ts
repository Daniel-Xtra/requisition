import passport from "passport";

import { UserModel } from "./../api/User";
import { AppError } from "./../utils/app-error";

/**
 * middleware for checking user authorization with jwt
 */

export const authorize = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      return next(new AppError("Unauthorized", null, 401));
    }

    try {
      const user = await UserModel.findOne({
        where: { email: token.email },
      });

      if (!user) {
        return next(new AppError("Unauthorized", null, 401));
      }
      req.user = user;
    } catch (error) {
      return next(error);
    }
    next();
  })(req, res, next);
};

export const authorizeICT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      return next(new AppError("Unauthorized", null, 401));
    }

    try {
      const userDetails = await UserModel.findByPk(token.id, { raw: true });
      if (userDetails.membership_type !== "ict") {
        return next(
          new AppError("You are not a valid ICT personnel", null, 400)
        );
      }

      const ict = await UserModel.findOne({
        where: { email: token.email },
      });

      if (!ict) {
        return next(new AppError("Unauthorized", null, 401));
      }

      if (ict.membership_type !== "ict") {
        return next(
          new AppError("You are not a valid ICT personnel", null, 400)
        );
      }

      req.user = ict;
    } catch (error) {
      return next(error);
    }
    next();
  })(req, res, next);
};

export const authorizeStore = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      return next(new AppError("Unauthorized", null, 401));
    }

    try {
      const userDetails = await UserModel.findByPk(token.id, { raw: true });
      if (userDetails.membership_type !== "store") {
        return next(
          new AppError("You are not a valid store manager", null, 400)
        );
      }

      const store = await UserModel.findOne({
        where: { email: token.email },
      });

      if (!store) {
        return next(new AppError("Unauthorized", null, 401));
      }

      if (store.membership_type !== "store") {
        return next(
          new AppError("You are not a valid store manager", null, 400)
        );
      }

      req.user = store;
    } catch (error) {
      return next(error);
    }
    next();
  })(req, res, next);
};

export const adminAuthorize = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (error, token) => {
    if (error || !token) {
      return next(new AppError("Unauthorized", null, 401));
    }

    try {
      const userDetails = await UserModel.findByPk(token.id, { raw: true });
      if (userDetails.membership_type !== "admin") {
        return next(new AppError("You are not a valid Admin", null, 400));
      }

      const admin = await UserModel.findOne({
        where: { email: token.email },
      });

      if (!admin) {
        return next(new AppError("Unauthorized", null, 401));
      }

      if (admin.membership_type !== "admin") {
        return next(new AppError("You are not a valid Admin", null, 400));
      }

      req.user = admin;
    } catch (error) {
      return next(error);
    }
    next();
  })(req, res, next);
};
