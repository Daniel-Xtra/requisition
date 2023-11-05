import { BaseController } from "../baseController";
import { IDivision } from "./IDivision";
import { DivisionService } from "./divisionService";

export class DivisionController extends BaseController {
  private _division = new DivisionService();

  /**
   * createDivision
  
   * @param data
   * @class divisionController
   */
  public createDivision = async (data: IDivision) => {
    const fresh = await this._division.createDivision(data);
    return this.sendResponse(fresh);
  };

  /**
   * updateDivision
 
   * @param slug
   * @param data
   */
  public updateDivision = async (slug: string, data: IDivision) => {
    const update = await this._division.updateDivision(slug, data);
    return this.sendResponse(update);
  };

  /**
   * delete
   * @param slug
   */
  public delete = async (slug: string) => {
    const del = await this._division.delDivision(slug);
    return this.sendResponse(del);
  };

  /**
   * getDivisions
   */
  public getDivisions = async () => {
    const all = await this._division.getDivisions();
    return this.sendResponse(all);
  };

  /**
   * delete
   * @param slug
   */
  public getDivision = async (slug: string) => {
    const all = await this._division.getDivision(slug);
    return this.sendResponse(all);
  };
}
