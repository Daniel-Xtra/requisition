import { AppError } from "./../../utils/app-error";
import { ProfileModel, IProfile } from ".";
import { UserModel } from "../User";

export class ProfileService {
  public getUserProfile = async (username: string) => {
    // find user from user model by username
    const user = await UserModel.findOne({ where: { username } });
    if (user) {
      // get user profile excluding id and user_id
      const profile = await ProfileModel.findOne({
        where: { user_id: user.id },
        attributes: {
          exclude: ["id", "user_id"],
        },
        raw: true,
      });

      return profile ? profile : null;
    }
    return `User with ${username} not found`;
  };

  /**
   * Update a user profile
   *
   * @param {Object} user the current user
   * @param {Object} profile the profile data to save
   * @returns {Object} the updated profile
   * @memberof ProfileController
   */

  public editProfile = async (user: any, profile: IProfile) => {
    const hasProfile: boolean = (await user.getProfile()) ? true : false;
    if (hasProfile) {
      // update profile of a user by user_id
      let updated = await ProfileModel.update(profile, {
        where: { user_id: user.id },
      });
      if (updated) {
        // return user profile
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update user profile");
    } else {
      // create profile in profile model
      const saved = await ProfileModel.create(profile);
      if (saved && user.setProfile(saved)) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not create user profile");
    }
  };

  /**
   * Saves uploaded profile photo
   *
   * @param {Object} user the current user
   * @param {Object} photo the uploaded photo with properties
   * @returns {Object} the updated profile data
   * @memberof ProfileController
   */

  public saveProfilePhoto = async (user: any, photo: any) => {
    const profileData = {
      profile_picture_url: photo.location,
    };
    const hasProfile: boolean = (await user.getProfile()) ? true : false;

    if (hasProfile) {
      // update profile of user by user_id
      let updated = await ProfileModel.update(profileData, {
        where: { user_id: user.id },
      });
      if (updated) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update profile picture");
    } else {
      // create and save profile
      const saved = await ProfileModel.create(profileData);
      if (saved && user.setProfile(saved)) {
        return await this.getUserProfile(user.username);
      }
      throw new AppError("Could not update profile picture");
    }
  };
}
