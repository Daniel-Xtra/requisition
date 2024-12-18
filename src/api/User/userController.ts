import { BaseController } from "../baseController";
import { IPassword } from "./IUser";
import { UserService } from "./userService";

/**
 * User controller
 *
 * @export
 * @class UserController
 */

export class UserController extends BaseController {
  private _userService = new UserService();

  public index = () => {
    return this.sendResponse("hello!");
  };

  /**
   * This function is used for get user
   * @param username
   */

  public getUser = async (username: string) => {
    // responsible for get user
    const user = await this._userService.getUser(username);
    return this.sendResponse(user);
  };

  /**
   * This function is used for update user
   * @param user
   * @param data
   */

  // public updateUser = async (user: IUser, data: IUser) => {
  //   // responsible for update user
  //   const updated = await this._userService.updateUser(user, data);
  //   return this.sendResponse(updated);
  // };

  public deleteAccount = async (username: string) => {
    const deleteUSer = await this._userService.deleteUserAccount(username);
    return this.sendResponse(deleteUSer);
  };

  public changePassword = async (user: any, data: IPassword) => {
    const change = await this._userService.changePassword(user, data);
    return this.sendResponse(change);
  };
}
