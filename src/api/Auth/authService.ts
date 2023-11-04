import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_SECRET_REFRESHTOKEN } from "./../../config";
import { IUser, UserModel } from "./../User";
import { AppError } from "./../../utils/app-error";
import { IUserModel } from "../../interfaces";
import bcryptjs from "bcryptjs";

export class AuthService {
  /**
   * Jwt token verifiation and find user details
   *
   * @param {string} token refresh token of user
   * @returns user details
   * @memberof AuthController
   */

  public async verifyJwtToken(token: string) {
    try {
      // verify the jwt token
      const decoded = await jwt.verify(token, JWT_SECRET_REFRESHTOKEN);
      // check the token is verified or not
      if (decoded) {
        // find userDetails from user model by decoded user_id
        const userDetails = await UserModel.findByPk(decoded.user.id, {
          raw: true,
        });
        return userDetails;
      }
    } catch (e) {
      throw new AppError("Invalid refresh token sent", "refreshToken", 404);
    }
  }
  /**
   * Jwt token validation and find user details
   *
   * @param {string} username
   * @returns user details
   * @memberof AuthController
   */

  public async validateUsername(username: string) {
    try {
      // TODO: check for username , phone number and email address
      const checkUsername = await UserModel.findOne({
        where: {
          username,
        },
        attributes: ["username"],
        raw: true,
      });
      return checkUsername;
    } catch (e) {
      throw new AppError("error fetching username");
    }
  }

  public async validateEmail(email: string) {
    try {
      // TODO: check for email address
      const checkEmail = await UserModel.findOne({
        where: {
          email,
        },
        raw: true,
      });
      return checkEmail;
    } catch (e) {
      throw new AppError("error fetching email");
    }
  }

  public async validatePhone(phone_number: string) {
    try {
      // TODO: check for phone number
      const checkPhone = await UserModel.findOne({
        where: {
          phone_number,
        },
        raw: true,
      });
      return checkPhone;
    } catch (e) {
      throw new AppError("error fetching phone");
    }
  }
  /**
   * This function is used for logout
   *
   * @param {string} userId of the current user
   * @returns updated
   * @memberof AuthController
   */

  public async logout(userId: number) {
    // update the player_id of the user model by the userId
    const updated = await UserModel.update(
      { player_id: null },
      { where: { id: userId } }
    );
    if (updated) {
      return updated;
    }
  }

  /**
   * This function is used for find user details by id
   *
   * @param {string} id of the current user
   * @returns userDetails
   * @memberof AuthController
   */

  public async findUserDetailsById(id: number) {
    // find user details from user model by id
    const user = <IUserModel>await UserModel.findOne({
      where: { id },
    });
    if (user) {
      return user;
    }
  }

  /**
   * generates JWT access token from user details
   *
   * @public
   * @param {IUser} user authenticated user
   * @returns {string} signed JWT
   * @memberof AuthController
   */

  public async generateToken(user: IUser) {
    const body = { id: user.id, email: user.email };
    // generate jwt access token using jwt_secret
    const token = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: "180d" });
    return token;
  }

  /**
   * generates JWT refresh token from user details
   *
   * @public
   * @param {IUser} user authenticated user
   * @returns {string} signed JWT
   * @memberof AuthController
   */

  public async generateRefreshToken(user: IUser) {
    const body = { id: user.id, email: user.email };
    // generate jwt access token using jwt_secret
    const refreshToken = jwt.sign({ user: body }, JWT_SECRET_REFRESHTOKEN, {
      expiresIn: "365d",
    });
    return refreshToken;
  }

  /**
   * get user details by email
   *
   * @public
   * @param {string} email
   * @returns user details
   * @memberof AuthController
   */

  public async getUserDetailsByEmail(email: string) {
    // get user details by email
    const user = await UserModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new AppError("No user exists with that email address.");
    }

    return user;
  }

  /**
   * Request for Password Reset
   *
   * @public
   * @param {string} password_reset_code
   * @param {Object} user
   * @returns updated
   * @memberof AuthController
   */

  public async requestPasswordReset(password_reset_code: string, user: IUser) {
    // update password_reset_code of user model by id
    const updated = await UserModel.update(
      { password_reset_code },
      {
        where: { id: user.id },
      }
    );
    if (!updated) {
      throw new AppError("An error occurred");
    }
    return updated;
  }

  /**
   * Request for verify reset code
   *
   * @public
   * @param {string} code
   * @returns user
   * @memberof AuthController
   */

  public async verifyResetCode(code: string) {
    // find user from user model by password_reset_code
    const user = await UserModel.findOne({
      where: { password_reset_code: code },
    });
    if (!user) {
      throw new AppError("Invalid password reset code");
    }
    return user;
  }

  /**
   * This function is responsible for reset password
   *
   * @public
   * @param {string} code
   * @param {string} password
   * @returns updated
   * @memberof AuthController
   */

  public async resetPassword(code: string, password: string) {
    // find user by password reset code
    const user = await UserModel.findOne({
      where: { password_reset_code: code },
    });
    if (!user) {
      throw new AppError("User not found");
    }
    const hash = bcryptjs.hashSync(password, 10);

    // update password by user id
    const updated = await UserModel.update(
      { password: hash, password_reset_code: null, pass_updated: 1 },
      {
        where: { id: user.id },
      }
    );
    if (!updated) {
      throw new AppError("Could not update password");
    }
    return updated;
  }
}
