import { IBaseInterface } from "../baseInterface";

export interface IRequest extends IBaseInterface {
  item: any;
  qty_required: any;
  qty_approved: any;
  qty_issued: any;
  status: any;
}
