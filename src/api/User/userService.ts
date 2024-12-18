import { UserModel } from "./userModel";
import { AppError } from "../../utils/app-error";
import { ProfileModel } from "../Profile";
//import generateSha1Hash from "sha1";
import { USER_EXCLUDES } from "../../utils/helpers";
import { DivisionModel } from "../Division";
import bcryptjs from "bcryptjs";
import { IPassword } from "./IUser";

export class UserService {
  /**
   * Function responsible for get user
   * @param {string} username
   * @returns user
   * @memberof UserController
   */

  public getUser = async (email: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { email },
      attributes: {
        exclude: ["password", "email_verification_code", "auth_key"],
      },
      include: [
        {
          model: ProfileModel,
          required: true,
          attributes: {
            exclude: ["updated_at", "deleted_at", "userId"],
          },
        },
        {
          model: DivisionModel,
          required: true,
          attributes: {
            exclude: ["updated_at", "deleted_at", "created_at"],
          },
        },
      ],
    });

    // check if user exists then the next operation can perform,or not
    if (user) {
      return user;
    }
    throw new AppError(`User '${email}' not found.`, null, 404);
  };

  /**
   * Get user status
   * @param {string} username of user
   * @returns user
   * @memberof UserController
   */

  public getUserStatus = async (username: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { username },
      attributes: {
        exclude: USER_EXCLUDES,
      },
    });

    if (user) {
      user = user.toJSON();

      return user;
    }

    throw new AppError(`User ${username} not found`, null, 404);
  };

  /**
   * Delete user data
   * @param {Object} user current user
   * @param {String} id
   * @returns {String} on success
   * @memberof UserController
   */

  public deleteUserAccount = async (username: string) => {
    try {
      // find user details by username
      const userDetails = await UserModel.findOne({
        where: { username },
      });

      if (userDetails) {
        // delete the user
        let destroyed = await UserModel.destroy({
          where: { username },
        });
        if (destroyed) return "User Account deleted";
        // await sendMailAfterDeleteAccount(userDetails);
        throw new AppError("Could not delete user account", null, 400);
      }
      throw new AppError(
        "Sorry, you cannot perform that operation.",
        null,
        400
      );
    } catch (error) {
      throw new AppError(error.message || "Could not delete user account");
    }
  };

  /**
   * changePassword
   */
  public changePassword = async (user: any, data: IPassword) => {
    const users = await UserModel.findOne({ where: { email: user.email } });

    if (users) {
      let validate = await bcryptjs.compare(data.old_password, user.password);
      if (!validate) {
        throw new AppError("Old password incorrect");
      } else {
        const passwordHash = bcryptjs.hashSync(data.new_password, 10);
        const updated = await UserModel.update(
          { password: passwordHash, pass_updated: 1 },
          { where: { email: user.email } }
        );
        return updated;
      }
    }
    throw new AppError("user not found", null, 404);
  };
}
