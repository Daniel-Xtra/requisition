import passport from "passport";
import { UserModel } from "./../api/User";
import { AppError } from "./../utils/app-error";

/**
 * middleware for checking admin authorization with jwt
 */

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
        where: { username: token.username },
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
