import { AppError } from "../../utils/app-error";
import { RequestService } from "../Request/requestService";
import { UserService } from "../User";
import { BaseController } from "../baseController";
import { AdminService } from "./adminService";

/* Admin Controller
 *
 *
 * @export
 * @class AdminController
 */

export class AdminController extends BaseController {
  private _adminService = new AdminService();
  private _requestService = new RequestService();
  private _userService = new UserService();

  /**
   * This function is used for get admin home
   * @param user
   */

  public getAllUsers = async (req: any) => {
    // responsible for get all users
    const all_users = await this._adminService.getAllUsers(
      req.sort_by,
      req.page_no,
      req.per_page
    );
    return this.sendResponse(all_users);
  };

  /**
   * This function is used for update user
   * @param username
   * @param data
   */

  public updateUser = async (email: string, data: any) => {
    // responsible for update user
    const updated = await this._adminService.updateUser(email, data);
    return this.sendResponse(updated);
  };

  public allRequest = async (req: any) => {
    const requests = await this._adminService.allRequest(
      req.sort_by,
      req.page_no,
      req.per_page,
      req.from,
      req.to
    );
    return this.sendResponse(requests);
  };

  public memberAnalytics = async () => {
    const analysis = await this._adminService.memberAnalytics();
    return this.sendResponse(analysis);
  };

  public individualRequest = async (email: string, req: any) => {
    try {
      const confirm = await this._userService.getUser(email);

      if (confirm) {
        const indi = await this._requestService.individualRequest(
          confirm,
          req.sort_by,
          req.page_no,
          req.per_page,
          req.from,
          req.to
        );

        return this.sendResponse(indi);
      }
      return this.sendResponse(confirm);
    } catch (error) {
      throw new AppError(error);
    }
  };

  public requestAnalyse = async () => {
    const analyse = await this._adminService.analysis();
    return this.sendResponse(analyse);
  };
}
