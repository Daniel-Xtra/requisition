import { BaseController } from "../baseController";
import { IctService } from "./ictService";

export class IctController extends BaseController {
  private _ictService = new IctService();
  /**
   * allRequest
   * @param req
   */
  public allRequest = async (req: any) => {
    const requests = await this._ictService.allRequest(
      req.sort_by,
      req.page_no,
      req.per_page
    );
    return this.sendResponse(requests);
  };
}
