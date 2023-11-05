import { BaseController } from "../baseController";
import { StoreService } from "./storeService";

export class StoreController extends BaseController {
  private _storeService = new StoreService();

  /**
   * allRequest
   * @param req
   */
  public allRequest = async (req: any) => {
    const requests = await this._storeService.allRequest(
      req.sort_by,
      req.page_no,
      req.per_page
    );
    return this.sendResponse(requests);
  };
}
