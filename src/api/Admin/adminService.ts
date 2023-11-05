import { UserModel } from "../User/userModel";
import { Op } from "sequelize";

import { GENERAL_EXCLUDES } from "../../utils/helpers";
import { ProfileModel } from "../Profile/profileModel";
import { AppError } from "../../utils/app-error";

import bcryptjs from "bcryptjs";

// import crypto from "crypto";
// import slugify from "slugify";
import { IUser } from "../User";

export class AdminService {
  /**
   * Get Admin Home
   * @param {Object} user the current user
   * @memberof AdminController
   */

  /**
   * Get All Users
   * @param {Object} user the current user
   * @param {Number} per_page
   * @param {String} post_next
   * @param {String} post_prev
   * @memberof AdminController
   */

  public getAllUsers = async (
    user: IUser,
    per_page: number = 15,
    post_next: string,
    post_prev: string
  ) => {
    const limit: number = Number(per_page);
    // responsible for paginate users with given limit
    let users = await (<any>UserModel).paginate({
      limit,
      desc: true,
      before: post_prev,
      after: post_next,
      attributes: [
        "id",
        "username",
        "email",
        "phone_number",
        "first_name",
        "last_name",
        "gender",
        "date_of_birth",
        "membership_type",
        "verified",
        "socket_id",
        "player_id",
        "pass_updated",
        "created_at",
        "updated_at",
      ],
      where: {
        membership_type: {
          [Op.ne]: "admin",
        },
      },
      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: GENERAL_EXCLUDES,
          },
        },
      ],
    });

    if (users) {
      // responsible for count total users
      const totalUsers = await UserModel.count();
      return {
        users: users.results,
        cursors: users.cursors,
        totalUsers,
      };
    }
    throw new AppError("No users found", null, 404);
  };

  /**
   * Updates a user resource
   * @public
   * @param {String} username the current user
   * @param {Object} data the data to be updated
   * @returns {(Object|null)} the updated user resource
   * @memberof AdminController
   */

  public updateUser = async (username: string, data: any) => {
    if (data.username) {
      throw new AppError("Cannot edit username");
    }

    if (data.password) {
      data.password = bcryptjs.hashSync(data.password, 10);
    }

    // update user data by username
    const updated = await UserModel.update(data, { where: { username } });
    if (!updated) {
      throw new AppError("Could not update user data");
    }
    return await this.getUser(username);
  };

  /**
   * Get user
   * @param {String} username
   * @returns user on success
   * @memberof AdminController
   */

  public getUser = async (username: string) => {
    // find user from user model by username
    let user = await UserModel.findOne({
      where: { username },
      attributes: {
        exclude: ["password", "email_verification_code", "auth_key"],
      },
      include: [
        {
          model: ProfileModel,
          attributes: {
            exclude: ["updated_at", "deleted_at", "userId"],
          },
        },
      ],
    });

    if (user) {
      return user;
    }
    throw new AppError(`User '${username}' not found.`, null, 404);
  };

  /**
   * Signup details
   * @param {Any} TODAY_START
   * @param {Any} NOW
   * @param {Any} WEEK_AGO
   * @param {Any} MONTH_AGO
   * @param {Any} YEAR_AGO
   * @returns user_counts on success
   * @memberof AdminController
   */

  /**
   * Create a new slug (unique url string) for the post
   * @param {string} str the post title
   * @return {string} the new slug string
   * @memberof AdminController
   */

  // private createSlug = (str: string) => {
  //   let newString = slugify(str, {
  //     remove: /[*+~.()'"!?:/@#${}<>,]/g,
  //     lower: true,
  //   });
  //   // create random slug
  //   const random = crypto.randomBytes(6).toString("hex");
  //   newString = `${newString}-${random}`;

  //   return newString;
  // };
}
