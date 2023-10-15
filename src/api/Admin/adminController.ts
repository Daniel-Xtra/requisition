import { BaseController } from "../baseController";
import { AdminService } from "./adminService";
import { IUser } from "../User";

/* Admin Controller
 *
 *
 * @export
 * @class AdminController
 */

export class AdminController extends BaseController {
  private _adminService = new AdminService();

  /**
   * This function is used for get admin home
   * @param user
   */

  public getAdminHome = async (user: IUser) => {
    // responsible for get admin home
    const admin_home = await this._adminService.getAdminHome(user);
    return this.sendResponse(admin_home);
  };

  public getAllUsers = async (
    user: IUser,
    per_page: number,
    post_next: string,
    post_prev: string
  ) => {
    // responsible for get all users
    const all_users = await this._adminService.getAllUsers(
      user,
      per_page,
      post_next,
      post_prev
    );
    return this.sendResponse(all_users);
  };

  /**
   * This function is used for update user
   * @param username
   * @param data
   */

  public updateUser = async (username: string, data: any) => {
    // responsible for update user
    const updated = await this._adminService.updateUser(username, data);
    return this.sendResponse(updated);
  };
}
