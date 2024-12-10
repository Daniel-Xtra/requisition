import { IUser } from "../User";
import { BaseController } from "../baseController";
import { IRequest, IRequests } from "./IRequest";
import { RequestService } from "./requestService";

export class RequestController extends BaseController {
  private _requestService = new RequestService();

  /**
   * fetchRequeest
   * @param unique_id
   */
  public fetchRequest = async (unique_id: string) => {
    const fetch = await this._requestService.fetchRequest(unique_id);
    return this.sendResponse(fetch);
  };

  /**
   * makeRequest
   * @param {Object} user
   * @param {Object} data
   */

  public makeRequest = async (user: IUser, data: IRequests) => {
    const fresh = await this._requestService.makeRequest(user, data);
    return this.sendResponse(fresh);
  };

  /**
   * reviewICT
   * @param {String} unique_id
   * @param {Object} data
   */
  public reviewICT = async (user: any, unique_id: string, data: IRequest) => {
    const review = await this._requestService.reviewICT(user, unique_id, data);
    return this.sendResponse(review);
  };

  /**
   * reviewSTORE
   * @param {String} unique_id
   * @param {Object} data
   */
  public reviewStore = async (user: any, unique_id: string, data: IRequest) => {
    const review = await this._requestService.reviewStore(
      user,
      unique_id,
      data
    );
    return this.sendResponse(review);
  };

  /**
   * individualRequest
   */
  public individualRequest = async (user: IUser, req: any) => {
    const all = await this._requestService.individualRequest(
      user,
      req.sort_by,
      req.page_no,
      req.per_page,
      req.from,
      req.to
    );
    return this.sendResponse(all);
  };

  public requestAnalyse = async (user: any) => {
    const analyse = await this._requestService.analysis(user);
    return this.sendResponse(analyse);
  };
}
