import passport = require("passport");
import { BaseController } from "../baseController";
import { AppError } from "./../../utils/app-error";
import { IUser, UserService } from "./../User";
import crypto from "crypto";
import { sendMailAfterRegister, sendPasswordReset } from "../../utils/email";
import { AuthService } from "./authService";

/* Auth Controller
 *
 * @export
 * @class AuthController
 */

export class AuthController extends BaseController {
  private _userService = new UserService();
  private _authService = new AuthService();

  /**
   * This function is used for user login
   * @param req
   * @param res
   * @param next
   */

  public login = async (req, res, next) => {
    // let body = req.body;
    // if (!body.code) {
    //   throw new AppError("Please update your app..");
    // }
    return new Promise((resolve, reject) => {
      return passport.authenticate("login", (err, user, info) => {
        // check if not a user or have any error
        if (!user || err) {
          return reject(new AppError(info.message));
        }
        return req.login(user, { session: false }, async (error) => {
          if (error) {
            return reject(new AppError(error));
          }
          // responsible for generating access token
          const token = await this._authService.generateToken(user);
          // responsible for generating refresh token
          const refreshToken = await this._authService.generateRefreshToken(
            user
          );
          // responsible for getting user details
          const userData = await this._userService.getUser(user.username);

          // send userData , accessToken and refreshToken in response
          resolve(
            this.sendResponse({
              user: userData,
              token,
              refreshToken,
            })
          );
        });
      })(req, res, next);
    });
  };

  /**
   * This function is used for admin login
   * @param req
   * @param res
   * @param next
   */

  public adminLogin = async (req, res, next) => {
    return new Promise((resolve, reject) => {
      return passport.authenticate("adminLogin", (err, user, info) => {
        // check if not a admin_user or have any error
        if (!user || err) {
          return reject(new AppError(info.message));
        }
        return req.login(user, { session: false }, async (error) => {
          if (error) {
            return reject(new AppError(error));
          }
          // responsible for generating access token
          const token = await this._authService.generateToken(user);
          // responsible for generating refresh token
          const refreshToken = await this._authService.generateRefreshToken(
            user
          );
          // responsible for getting admin_user details
          const userData = await this._userService.getUser(req.body.username);
          // send admin_userData , accessToken and refreshToken in response
          resolve(this.sendResponse({ user: userData, token, refreshToken }));
        });
      })(req, res, next);
    });
  };

  /**
   * This function is used for signup
   * @param user
   */

  public signup = async (user: IUser) => {
    //check for code for the new app
    // if (!user.code) {
    //   throw new AppError("Please update your app.");
    // }
    // responsible for generating access token
    const accessToken = await this._authService.generateToken(user);
    // responsible for getting user details
    const newUser = await this._userService.getUser(user.username);
    // responsible for generating refresh token
    const refreshToken = await this._authService.generateRefreshToken(user);
    // responsible for send mail after registered successfully
    let sent = sendMailAfterRegister(user);
    if (!sent) {
      throw new AppError("An error occurred");
    }
    return this.sendResponse(
      { user: newUser, token: accessToken, refreshToken },
      "User registration successful"
    );
  };

  /**
   * This function is used for generating new access and refresh token
   * @param token
   */

  public refreshTokens = async (token: string) => {
    // responsible for verify the jwt token
    const userDetails = await this._authService.verifyJwtToken(token);
    // if jwt token verified then perform the next operation or not
    if (userDetails) {
      // responsible for generating new access token
      const token = await this._authService.generateToken(userDetails);
      // responsible for generating new refresh token
      const refreshToken = await this._authService.generateRefreshToken(
        userDetails
      );
      return this.sendResponse({ token, refreshToken });
    }
  };

  /**
   * This function is used for generating tokens by id
   * @param id
   */

  public refreshTokensById = async (id: number, token: string) => {
    // responsble for find user details by id
    const user = await this._authService.findUserDetailsById(id);
    if (!user) {
      throw new AppError("Invalid user ID", null, 404);
    }
    // responsible for verify the jwt token
    const userDetails = await this._authService.verifyJwtToken(token);
    // Check if verified jwt token userId is same as given id or not
    if (userDetails.id == id) {
      // responsible for generating new access token
      const token = await this._authService.generateToken(userDetails);
      // responsible for generating new refresh token
      const refreshToken = await this._authService.generateRefreshToken(
        userDetails
      );
      return this.sendResponse({
        token,
        refreshToken,
        username: userDetails.username,
      });
    }
    throw new AppError("UserId is not verified", null, 404);
  };

  /**
   * This function is used for logout
   * @param user
   */

  public logout = async (user: IUser) => {
    // responsible for logout by user_id
    const updated = await this._authService.logout(user.id);
    if (updated) {
      return this.sendResponse("Logged out successfully.");
    }
  };

  /**
   * This function is used for request password reset
   * @param email
   */

  public requestPasswordReset = async (email: string, body: any) => {
    // if (!body.code) {
    //   throw new AppError("Please update your app..");
    // }
    // responsible for get user details by email
    const user = await this._authService.getUserDetailsByEmail(email);
    // responsible for generate password reset code
    const password_reset_code = this.generatePasswordResetCode();
    // responsible for request password reset
    const updated = await this._authService.requestPasswordReset(
      password_reset_code,
      user
    );
    if (updated) {
      // responsible for send password reset code to email
      let sent = sendPasswordReset(password_reset_code, user);
      if (!sent) {
        throw new AppError("An error occurred");
      }
      return this.sendResponse({
        status: true,
        message: `Reset password code has been sent to ${email}.`,
        statusCode: 200,
      });
    }
  };

  /**
   * This function is used for verify reset code
   * @param code
   */

  public verifyResetCode = async (code: string) => {
    // responsible for verify the reset code
    const isValid = await this._authService.verifyResetCode(code);
    if (isValid) {
      return this.sendResponse("Password reset code is valid");
    }
  };

  /**
   * This function is used for reset password
   * @param code
   * @param password
   */

  public resetPassword = async (code: string, password: string) => {
    // checking code and password both given or not
    if (!code || !password) {
      throw new AppError(
        "Please provide both your password reset code and new password"
      );
    }
    // responsible for reset password
    const resetDone = await this._authService.resetPassword(code, password);
    if (resetDone) {
      return this.sendResponse("Password reset successfully");
    }
  };
  /**
   * This function is used for validate username
   * @param code
   */

  public validateUsername = async (username: string) => {
    // responsible for validate username
    const isValid = await this._authService.validateUsername(username);
    return this.sendResponse(isValid);
  };

  public validateEmail = async (email: string) => {
    // responsible for validate email
    const isValid = await this._authService.validateEmail(email);
    return this.sendResponse(isValid);
  };

  public validatePhone = async (phone: string) => {
    // responsible for validate phone
    const isValid = await this._authService.validatePhone(phone);
    return this.sendResponse(isValid);
  };

  /**
   * generate password reset code
   */

  private generatePasswordResetCode = () => {
    return crypto.randomBytes(3).toString("hex");
  };
}
