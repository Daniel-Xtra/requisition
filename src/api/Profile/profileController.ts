import { BaseController } from "../baseController";
import { ProfileService } from "./profileService";
import { IUser } from "../User";
import { IProfile } from ".";

/**
 * Profile controller
 *
 * @export
 * @class ProfileController
 */

export class ProfileController extends BaseController {
  private _profileService = new ProfileService();

  public index = () => {
    return this.sendResponse("profile");
  };

  /**
   * This function is used for get profile
   * @param username
   */

  public getProfile = async (username: string) => {
    // responsible for get user profile
    const user = await this._profileService.getUserProfile(username);
    return this.sendResponse(user);
  };

  /**
   * This function is used for edit profile
   * @param user the current user
   * @param profile
   */

  public editProfile = async (user: IUser, profile: IProfile) => {
    // responsible for edit profile
    const updated = await this._profileService.editProfile(user, profile);
    return this.sendResponse(updated);
  };

  /**
   * Calls sevice to save uploaded profile photo
   *
   * @param {Object} user the current user
   * @param {Object} photo the uploaded photo with properties
   */
  public saveProfilePhoto = async (user: IUser, photo: any) => {
    // responsible for save profile photo
    const profile = await this._profileService.saveProfilePhoto(user, photo);
    return this.sendResponse(profile);
  };
}
