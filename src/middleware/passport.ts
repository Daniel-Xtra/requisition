import bcryptjs from "bcryptjs";
import crypto from "crypto";
import generateSha1Hash from "sha1";
import _ from "lodash";
import { ExtractJwt, Strategy as JWTstrategy } from "passport-jwt";
import { Strategy as localStrategy } from "passport-local";
import { UserModel } from "../api/User";
import { JWT_SECRET } from "./../config/index";
import { AppError } from "./../utils/app-error";

import { ProfileModel } from "../api/Profile";
import { IUserModel } from "../interfaces";
import { Op } from "sequelize";
import validator from "validator";

/**
 * This function is used for signup strategy
 * @param req
 * @param username
 * @param password
 * @param done
 */

export const signupStrategy = new localStrategy(
  {
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, username, password, done) => {
    try {
      const body: any = _.pick(req.body, [
        "username",
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
      ]);

      // TODO: check for username , phone number and email address
      const checkDuplicateOrNot = await UserModel.findOne({
        where: {
          [Op.or]: [
            { username: body.username },
            { email: body.email },
            { phone_number: body.phone_number },
          ],
        },
        raw: true,
      });
      // if (checkDuplicateOrNot == null)
      //   return done(
      //     new AppError(
      //       `Unable to register this username, please contact admin.`
      //     )
      //   );
      if (checkDuplicateOrNot) {
        if (checkDuplicateOrNot.username == body.username) {
          return done(
            new AppError(`An account with that username already exists.`)
          );
        } else if (checkDuplicateOrNot.email == body.email) {
          return done(
            new AppError(`An account with that email already exists`)
          );
        } else if (checkDuplicateOrNot.phone_number == body.phone_number) {
          return done(
            new AppError(`Sorry, that phone number is already in use.`)
          );
        }
      }

      const passwordHash = bcryptjs.hashSync(password, 10);
      const emailVerificationCode = generateEmailVerificationCode();
      // create new user
      const user = await UserModel.create({
        username,
        password: passwordHash,
        email_verification_code: emailVerificationCode,
        pass_updated: 1,
        ...body,
      });

      const profile = await ProfileModel.create();

      await user.setProfile(profile);

      // Send the user information to the next middleware
      return done(null, user);
    } catch (error) {
      done(Error(error));
    }
  }
);

/**
 * This function is used for login strategy
 * @param username
 * @param password
 * @param done
 */

export const loginStrategy = new localStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, done) => {
    try {
      let loginFailed = false;
      let user;
      if (validator.isEmail(username)) {
        // find user by username
        user = <IUserModel>(
          await UserModel.findOne({ where: { email: username } })
        );
      } else {
        // find user by username
        user = <IUserModel>await UserModel.findOne({ where: { username } });
      }
      if (user) {
        let validate: boolean;
        const pass_updated = user.pass_updated;
        if (pass_updated == 0) {
          if (generateSha1Hash(password) != user.password) {
            validate = false;
          } else {
            const passwordHash = bcryptjs.hashSync(password, 10);
            await UserModel.update(
              { password: passwordHash, pass_updated: 1 },
              { where: { username: user.username } }
            );
            validate = await bcryptjs.compare(password, passwordHash);
          }
        } else {
          validate = await bcryptjs.compare(password, user.password);
        }

        if (!validate) {
          loginFailed = true;
        }
      } else {
        loginFailed = true;
      }
      if (loginFailed) {
        return done(null, false, {
          message: "Incorrect username/email or password.",
        });
      }
      // Send the user information to the next middleware
      return done(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return done(error);
    }
  }
);

/**
 * This function is used for admin login strategy
 * @param username
 * @param password
 * @param done
 */

export const adminLoginStrategy = new localStrategy(
  {
    usernameField: "username",
    passwordField: "password",
  },
  async (username, password, done) => {
    try {
      let loginFailed = false;
      // find user by username
      const user = <IUserModel>await UserModel.findOne({ where: { username } });
      if (user) {
        // check membership type is admin or not
        if (user.membership_type == "admin") {
          let validate: boolean;
          const pass_updated = user.pass_updated;
          if (pass_updated == 0) {
            if (generateSha1Hash(password) != user.password) {
              validate = false;
            } else {
              const passwordHash = bcryptjs.hashSync(password, 10);
              await UserModel.update(
                { password: passwordHash, pass_updated: 1 },
                { where: { username } }
              );
              validate = await bcryptjs.compare(password, passwordHash);
            }
          } else {
            validate = await bcryptjs.compare(password, user.password);
          }
          if (!validate) {
            loginFailed = true;
          }
        } else {
          return done(null, false, {
            message: "You are not authorized to login.",
          });
        }
      } else {
        loginFailed = true;
      }
      if (loginFailed) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
      }
      // Send the user information to the next middleware
      return done(null, user, { message: "Logged in Successfully" });
    } catch (error) {
      return done(error);
    }
  }
);

/**
 * This function is used for jwt strategy
 * @param token
 * @param done
 */

export const jwtStrategy = new JWTstrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (token, done) => {
    try {
      // Pass the user details to the next middleware
      return done(null, token.user);
    } catch (error) {
      done(error);
    }
  }
);

/**
 * generates unique code for email verification
 * @returns {string} hexadecimal string
 */

function generateEmailVerificationCode() {
  // generate email verification code
  const str = crypto.randomBytes(20).toString("hex");
  return str;
}
